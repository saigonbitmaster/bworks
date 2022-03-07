'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');
const ObjectID = require('mongodb').ObjectId;
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = ClientMeterNumber => {
  // xuat hoa don cho theo tung thon / ap / khu pho
  ClientMeterNumber.exportInvoiceByGeo = async (time, filterValues, session) => {
    // console.log('>>>exportInvoiceByGeo', time, filterValues);
    if (!time) {
      return false;
    }

    let { districtId, wardId, quarterId } = filterValues;

    let companies = await getConnectorFromModel(ClientMeterNumber, 'CtmCompany')
      .find({ active: true }, { session })
      .toArray();
    if (!companies || companies.length > 1) {
      return false;
    }
    // let company = companies[0].__data;
    let company = companies[0];

    let clientFilters = {
      termInvoice: {
        $gte: moment(time)
          .startOf('month')
          .toDate(),
      },
      startMeterDate: {
        $lt: moment(time)
          .startOf('month')
          .toDate(),
      },
    };

    let termMonthFormat = moment(clientFilters.termInvoice.$gte).format('-YYYY-MM');

    let cdt = {};
    let tmp = [];
    if (districtId) {
      // tmp.push({ districtId });
      tmp.push({ districtId: toObjectId(districtId) });
    }
    if (wardId) {
      // tmp.push({ wardId });
      tmp.push({ wardId: toObjectId(wardId) });
    }
    if (quarterId) {
      // tmp.push({ id: quarterId });
      tmp.push({ _id: toObjectId(wardId) });
    }
    if (tmp.length) {
      cdt = { $and: tmp };
    }

    // let quarters = await ClientMeterNumber.app.models.GeoQuarter.find(cdt);
    let quarters = await getConnectorFromModel(ClientMeterNumber, 'GeoQuarter')
      .find(cdt, { session })
      .toArray();
    if (!quarters || !quarters.length) {
      return false;
    }
    // console.log('START export invoice by geo');
    for (let i = 0; i < quarters.length; i++) {
      let itemQuarter = quarters[i];

      let aggQuery = getAggQuery(
        clientFilters,
        termMonthFormat,
        itemQuarter.districtId,
        itemQuarter.wardId,
        itemQuarter.id,
      );
      // console.log('==> quarter: ', itemQuarter.name);
      let dataInvoice = await aggregate(ClientMeterNumber.app.models.Client, aggQuery, session);
      // console.log('==> dataInvoice: ', dataInvoice);
      if (dataInvoice.length) {
        const rawStoreInvoice = getConnectorFromModel(ClientMeterNumber, 'StoreInvoice');

        let invoices = ClientMeterNumber.handleFormatInvoices(dataInvoice, company, true);
        let idStore = `${itemQuarter.id}${termMonthFormat}`; // quarterId-YYYY-MM
        if (!invoices || !invoices.length) {
          await rawStoreInvoice.deleteMany({ _id: idStore }, { session });
          continue;
        }
        let data = { invoices };
        // console.log('    + count invoice: ', data, invoices.length);
        let urlInvoice = await ClientMeterNumber.getPathByInvoiceData(ClientMeterNumber, data);
        // console.log('    + file name invoice: ', urlInvoice);
        if (urlInvoice) {
          // save
          let data = {
            _id: idStore,
            fileName: urlInvoice,
            quarterId: toObjectId(itemQuarter.id),
            wardId: toObjectId(itemQuarter.wardId),
            districtId: toObjectId(itemQuarter.districtId),
            provinceId: toObjectId(itemQuarter.provinceId),
            termInvoice: moment(time)
              .startOf('month')
              .toDate(),
            nameQuarter: itemQuarter.name,
            countExportedInvoice: invoices.length,
          };
          await rawStoreInvoice.updateOne({ _id: idStore }, { $set: data }, { upsert: true, session });
        }
      }
    }
    // console.log('END export invoice by geo');
    return true;
  };

  const getAggQuery = (condition, termMonthFormat, districtId, wardId, quarterId) => {
    if (districtId) {
      condition.districtId = new ObjectID(districtId);
    }
    if (wardId) {
      condition.wardId = new ObjectID(wardId);
    }
    if (quarterId) {
      condition.quarterId = new ObjectID(quarterId);
    }
    condition.status = 'ACTIVE';
    return [
      {
        $match: condition,
      },
      { $project: { termId: { $concat: [{ $convert: { input: '$_id', to: 'string' } }, termMonthFormat] } } },
      {
        $lookup: {
          from: 'ClientMeterNumber',
          let: {
            termId: '$termId',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$termId'],
                },
              },
            },
            {
              $project: {
                invoiceData: 1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: 'meterNumber',
        },
      },
      { $unwind: '$meterNumber' },
      { $replaceRoot: { newRoot: '$meterNumber' } },
    ];
  };
};
