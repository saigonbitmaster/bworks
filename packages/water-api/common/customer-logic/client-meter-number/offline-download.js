'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const { get, set } = require('lodash');
const aggregate = require('../../utils/aggregate');
const { utc } = require('../../../server/config.json');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.offlineDownload = async (termMonth, quarterId, page = 1, perPage = 500, options) => {
    let termData = {};
    const Client = ClientMeterNumber.app.models.Client;
    if (options.accessToken) {
      let user = await options.accessToken.user.get();
      const { wardInChargeIds: tempWICIArray = [], quarterInChargeIds: tempQICIArray = [] } = user;
      const wardInChargeIds = tempWICIArray.map(wardId => new ObjectID(wardId));
      const quarterInChargeIds = tempQICIArray.map(quarterId => new ObjectID(quarterId));
      if (wardInChargeIds && wardInChargeIds.length) {
        let query = queryGetData({ termMonth, quarterId, page, perPage, wardInChargeIds });
        if (quarterInChargeIds && quarterInChargeIds.length > 0) {
          query = queryGetData({ termMonth, quarterId, page, perPage, wardInChargeIds, quarterInChargeIds });
        }
        termData = await aggregate(Client, query);
        termData = termData && termData.length == 1 ? termData[0] : {};
      }
    }
    const { data = [], info = [] } = termData || {};
    data.map(item => {
      item.offlineTerm = termMonth;
      if (!item.fromDate) {
        item.fromDate = moment(termMonth)
          .subtract(1, 'month')
          .startOf('month')
          .add(15, 'day')
          .toDate();
      }
      if (!item.toDate) {
        item.toDate = moment(item.fromDate)
          .add(1, 'month')
          .startOf('day')
          .toDate();
      }
    });
    return { data, page, perPage, total: get(info, '[0].total') || 0 };
  };

  ClientMeterNumber.remoteMethod('offlineDownload', {
    accepts: [
      { arg: 'termMonth', type: 'date', required: true },
      { arg: 'quarterId', type: 'string', required: false },
      { arg: 'page', type: 'number', required: true },
      { arg: 'perPage', type: 'number', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });

  const queryGetData = ({ termMonth, quarterId, page = 1, perPage = 500, wardInChargeIds, quarterInChargeIds }) => {
    const limitTo = moment(termMonth).endOf('month');
    const startMonth = moment(limitTo).startOf('month');
    const selectedMonth = moment(termMonth);
    const disabled = moment().diff(selectedMonth, 'month') < 0 ? true : false;
    const query = [
      {
        $match: {
          wardId: {
            $in: wardInChargeIds,
          },
          status: 'ACTIVE',
          startMeterDate: { $lt: startMonth.toDate() },
          $and: [
            {
              termMeterNumber: {
                $gte: moment(termMonth)
                  .subtract(1, 'month')
                  .startOf('month')
                  .toDate(),
              },
            },
            {
              termMeterNumber: {
                $lt: moment(termMonth)
                  .endOf('month')
                  .toDate(),
              },
            },
          ],
        },
      },
      {
        $facet: {
          info: [
            {
              $count: 'total',
            },
          ],
          data: [
            {
              $skip: (page - 1) * perPage,
            },
            {
              $limit: perPage,
            },
            {
              $addFields: {
                monthId: {
                  $concat: [{ $convert: { input: '$_id', to: 'string' } }, moment(termMonth).format('-YYYY-MM')],
                },
              },
            },
            {
              $lookup: {
                from: 'ClientMeterNumber',
                let: { monthId: `$monthId` },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$monthId'],
                      },
                    },
                  },
                  {
                    $project: {
                      id: '$_id',
                      previousNumber: 1,
                      currentNumber: 1,
                      fromDate: 1,
                      updatedDate: 1,
                      toDate: 1,
                    },
                  },
                ],
                as: 'clientMeterNumber',
              },
            },
            {
              $unwind: { path: '$clientMeterNumber', preserveNullAndEmptyArrays: true },
            },
            {
              $lookup: {
                from: 'ClientMeter',
                let: {
                  clientId: '$_id',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$clientId', '$$clientId'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      qrCode: 1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
                as: 'clientMeter',
              },
            },
            {
              $unwind: { path: '$clientMeter', preserveNullAndEmptyArrays: true },
            },
            {
              $addFields: {
                id: '$_id',
                previousNumber: {
                  $switch: {
                    branches: [
                      {
                        case: { $not: ['$clientMeterNumber'] },
                        then: '$lastMeterNumber',
                      },
                      {
                        case: { $lt: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.currentNumber',
                      },
                      {
                        case: { $gte: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.previousNumber',
                      },
                    ],
                    default: '$lastMeterNumber',
                  },
                },
                fromDate: {
                  $switch: {
                    branches: [
                      {
                        case: { $not: ['$clientMeterNumber'] },
                        then: '$lastTimeMeterNumberUpdate',
                      },
                      {
                        case: { $lt: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.toDate',
                      },
                      {
                        case: { $gte: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.fromDate',
                      },
                    ],
                    default: '$lastTimeMeterNumberUpdate',
                  },
                },
                toDate: {
                  $switch: {
                    branches: [
                      {
                        case: { $not: ['$clientMeterNumber'] },
                        then: null,
                      },
                      {
                        case: { $lt: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: null,
                      },
                      {
                        case: { $gte: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.toDate',
                      },
                    ],
                    default: null,
                  },
                },
                currentNumber: {
                  $switch: {
                    branches: [
                      {
                        case: { $lt: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: null,
                      },
                      {
                        case: { $gte: ['$clientMeterNumber.toDate', startMonth.toDate()] },
                        then: '$clientMeterNumber.currentNumber',
                      },
                    ],
                    default: null,
                  },
                },
                disabled: disabled || {
                  $or: [
                    {
                      $eq: ['$startMeterDate', null],
                    },
                    {
                      $lt: [
                        moment(termMonth)
                          .endOf('month')
                          .toDate(),
                        '$startMeterDate',
                      ],
                    },
                    {
                      $and: [
                        {
                          $ne: [
                            { $month: { date: selectedMonth.toDate(), timezone: utc } },
                            { $month: { date: '$lastTimeMeterNumberUpdate', timezone: utc } },
                          ],
                        }, // edit
                        {
                          $ne: [
                            { $month: { date: selectedMonth.toDate(), timezone: utc } },
                            {
                              $month: {
                                date: { $add: ['$lastTimeMeterNumberUpdate', 1000 * 60 * 60 * 24 * 30] },
                                timezone: utc,
                              },
                            }, // write new
                          ],
                        },
                      ],
                    },
                    {
                      $lte: [
                        moment(termMonth)
                          .startOf('month')
                          .toDate(),
                        '$termInvoice',
                      ],
                    },
                  ],
                },
                updatedDate: '$clientMeterNumber.updatedDate',
                qrCode: '$clientMeter.qrCode',
                offlineTerm: startMonth.toDate(),
              },
            },
            {
              $lookup: {
                from: 'ClientMeterHistory',
                let: {
                  clientId: '$_id',
                  fromDate: '$fromDate',
                  toDate: '$toDate',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ['$clientId', '$$clientId'],
                          },
                          {
                            $gte: ['$setupDate', '$$fromDate'],
                          },
                          {
                            $eq: ['$$toDate', null],
                          },
                          {
                            $eq: ['$type', 'REPLACE'],
                          },
                        ],
                      },
                    },
                  },
                  {
                    $sort: {
                      setupDate: -1,
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
                as: 'histories',
              },
            },
            {
              $unwind: { path: '$histories', preserveNullAndEmptyArrays: true },
            },
            {
              $project: {
                id: '$_id',
                name: 1,
                serial: 1,
                wardId: 1,
                quarterId: 1,
                code: 1,
                termInvoice: 1,
                lastTimeMeterNumberUpdate: 1,
                startMeterDate: 1,
                lastMeterNumber: 1,
                termMeterNumber: 1,
                formattedAddress: 1,
                position: 1,
                toDate: 1,
                fromDate: 1,
                previousNumber: 1,
                currentNumber: 1,
                updatedDate: 1,
                qrCode: 1,
                offlineTerm: 1,
                disabled: 1,
                clientMeterNumber: 1,
                histories: 1,
              },
            },
          ],
        },
      },
    ];

    if (quarterId) {
      if (typeof quarterId === 'string') {
        set(query, '0.$match.quarterId', new ObjectID(quarterId));
      } else {
        set(query, '0.$match.quarterId', { $in: quarterInChargeIds });
      }
    }

    return query;
  };
};
