'use strict';
const moment = require('moment-timezone');
const has = require('lodash/has');
const flatten = require('lodash/flatten');
const groupBy = require('lodash/groupBy');
const omit = require('lodash/omit');
const set = require('lodash/set');
const get = require('lodash/get');
const pick = require('lodash/pick');
const debug = require('debug')('water-api:generate-fake-client-data');
const aggregate = require('../../common/utils/aggregate');
const { utc } = require('../config.json');
const sortObjectByKey = require('../../common/utils/sort-object-by-key');
const toObjectId = require('../../common/utils/to-object-id');
const simulatedSaigonClients = require('../test-data/SaigonClient');

const createFakeMeterNumber = (upperLimit, meterNumbers) => {
  const allMeterNumbers = flatten(
    meterNumbers.map(meterNumber => {
      const newMeterNumbers = [];
      let newMeterNumber = createFakeMeterNumberHelper(meterNumber);
      while (moment(newMeterNumber.toDate).isBefore(moment(upperLimit))) {
        newMeterNumbers.push(newMeterNumber);
        newMeterNumber = createFakeMeterNumberHelper(newMeterNumber);
      }
      return newMeterNumbers;
    }),
  );
  const allMeterNumbersGroupedByMonth = sortObjectByKey(groupBy(allMeterNumbers, 'groupKey'));
  return allMeterNumbersGroupedByMonth;
};

const createFakeMeterNumberHelper = meterNumber => {
  const newMeterNumber = pick(meterNumber, ['clientId', 'paymentStatus', 'fromDate', 'previousNumber']);
  if (!has(meterNumber, 'currentNumber') || !has(meterNumber, 'toDate')) {
    newMeterNumber.toDate = moment(meterNumber.fromDate)
      .add(1, 'month')
      .date(15)
      .toDate();
    newMeterNumber.currentNumber = meterNumber.previousNumber + Math.round(Math.random() * 100 + 1);
    newMeterNumber.id = `${meterNumber.clientId}-${moment(newMeterNumber.toDate).format('YYYY-MM')}`;
    newMeterNumber.groupKey = moment(newMeterNumber.toDate).format('YYYY-MM');
  } else {
    newMeterNumber.previousNumber = meterNumber.currentNumber;
    newMeterNumber.currentNumber = meterNumber.currentNumber + Math.round(Math.random() * 100 + 1);
    newMeterNumber.fromDate = moment(meterNumber.toDate).toDate();
    newMeterNumber.toDate = moment(meterNumber.toDate)
      .add(1, 'month')
      .toDate();
    newMeterNumber.id = `${meterNumber.clientId}-${moment(newMeterNumber.toDate).format('YYYY-MM')}`;
    newMeterNumber.groupKey = moment(newMeterNumber.toDate).format('YYYY-MM');
  }
  return newMeterNumber;
};

module.exports = async app => {
  if (!process.env.NODE_INIT_TEST_DATA) {
    return;
  }
  // Assign simulated Saigon client data to some of previous data
  const currentClients = await app.models.Client.find({ limit: simulatedSaigonClients.length });
  const replacedAttributes = [
    'code',
    'name',
    'formattedAddress',
    'position',
    'type',
    'familyCount',
    'memberCount',
    'contractNo',
    'contractStatus',
    'provinceId',
    'districtId',
    'quarterId',
    'wardId',
  ];
  if (currentClients.length >= simulatedSaigonClients.length) {
    for (let index = 0; index < simulatedSaigonClients.length; index++) {
      const saigonClient = simulatedSaigonClients[index];
      const randomCurrentClient = currentClients[index];
      for (const replacedAttribute of replacedAttributes) {
        if (has(saigonClient, replacedAttribute)) {
          let newAttribute = saigonClient[replacedAttribute];
          if (replacedAttribute === 'position') {
            if (saigonClient.position) {
              const { lng, lat } = saigonClient.position;
              try {
                if (lat && lng) {
                  const newGeopoint = new app.loopback.GeoPoint({ lat: parseFloat(lat), lng: parseFloat(lng) });
                  newAttribute = newGeopoint;
                }
              } catch (err) {
                continue;
              }
            }
          } else if (replacedAttribute.endsWith('Id')) {
            newAttribute = toObjectId(saigonClient[replacedAttribute]);
          }
          set(randomCurrentClient, replacedAttribute, newAttribute);
        }
      }
      await randomCurrentClient.save();
    }
  }

  // Determine the month where majority of clients havent written meter number
  const query = [
    { $match: { status: 'ACTIVE' } },
    { $group: { _id: '$termMeterNumber', clients: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $limit: 1 },
  ];

  const rawMajorityMonth = await aggregate(app.models.Client, query);
  let majorityMonth = get(rawMajorityMonth, '0._id');
  if (!majorityMonth) {
    return;
  }
  majorityMonth = moment(majorityMonth);
  const lowerLimit = moment(majorityMonth).add(1, 'month');
  // Only execute below steps until we are 1 month away from the month that published latest invoice
  const latestEinvoice = await app.models.EInvoiceData.getLatestEinvoice(null, false);
  const upperLimit = (latestEinvoice ? moment(latestEinvoice) : moment()).subtract(1, 'month').endOf('month');

  const monthsToWriteMeterNumber = [
    ...new Array(moment(upperLimit).diff(lowerLimit, 'month', false) + 1),
  ].map((_, index) => moment(lowerLimit).add(index, 'month'));

  // Get previous meter numbers
  const previousMeterNumbers = await aggregate(app.models.Client, [
    { $match: { termMeterNumber: { $gte: majorityMonth.toDate() } } },
    {
      $addFields: {
        meterNumberId: {
          $concat: [
            { $toString: '$_id' },
            { $dateToString: { format: '-%Y-%m', date: '$termMeterNumber', timezone: utc } },
          ],
        },
      },
    },
    {
      $lookup: {
        from: 'ClientMeterNumber',
        localField: 'meterNumberId',
        foreignField: '_id',
        as: 'meterNumber',
      },
    },
    { $unwind: '$meterNumber' },
    {
      $project: {
        clientId: '$_id',
        previousNumber: '$meterNumber.currentNumber',
        fromDate: '$meterNumber.toDate',
        paymentStatus: { $literal: false },
      },
    },
  ]);

  const fakeMeterNumbersGroupedByMonth = createFakeMeterNumber(upperLimit, previousMeterNumbers);

  // Bulk write meter number for the clients
  // Bulk lock invoices for newly written meter numbers
  const lockedInvoiceClients = {};
  for (const rawMonth of monthsToWriteMeterNumber) {
    const month = moment(rawMonth).format('YYYY-MM');
    if (fakeMeterNumbersGroupedByMonth[month]) {
      const fakeMeterNumbers = fakeMeterNumbersGroupedByMonth[month].map(meterNumber => omit(meterNumber, 'groupKey'));

      const notInvoiceLockedLastMonth = [];
      const InvoiceLockedLastMonth = [];
      for (const { clientId } of fakeMeterNumbers) {
        if (!lockedInvoiceClients[clientId]) {
          notInvoiceLockedLastMonth.push(clientId);
        } else {
          InvoiceLockedLastMonth.push(clientId);
        }
      }

      // Avoid locking previously paid invoices
      // const ClientMeterNumber = getConnectorFromModel(app.models.ClientMeterNumber);
      const unpaidAndNotInvoiceLockedLastMonth = await app.models.ClientMeterNumber.find({
        where: {
          id: {
            inq: notInvoiceLockedLastMonth.map(
              id =>
                `${id}-${moment(rawMonth)
                  .subtract(1, 'month')
                  .format('YYYY-MM')}`,
            ),
            paymentStatus: false,
          },
        },
        fields: { clientId: true },
      }).then(ids => ids.map(({ clientId }) => clientId));
      const filterValues = {};
      if (notInvoiceLockedLastMonth.length > 0) {
        await app.models.ClientMeterNumber.calculateInvoicesInternal({
          month: moment(rawMonth)
            .subtract(1, 'month')
            .toDate(),
          ids: unpaidAndNotInvoiceLockedLastMonth,
          filterValues,
        });
      }

      await app.models.ClientMeterNumber.bulkWriteNewMonth(fakeMeterNumbers, {});
      await app.models.ClientMeterNumber.calculateInvoicesInternal({
        month: moment(rawMonth).toDate(),
        ids: InvoiceLockedLastMonth.concat(notInvoiceLockedLastMonth),
        filterValues,
      });

      debug(`Add fake data for month ${moment(rawMonth).format('YYYY-MM')}`);
    }
  }
  debug('Done generating fake client data');

  // Reindex the Client and ClientMeterNumber collection
  await app.models.Client.dataSource.autoupdate(app.models.Client.modelName);
  await app.models.ClientMeterNumber.dataSource.autoupdate(app.models.ClientMeterNumber.modelName);
  await debug('Done reindexing Client collection');
};
