'use strict';
const ObjectID = require('mongodb').ObjectID;
const moment = require('moment-timezone');
const numeral = require('numeral');
const get = require('lodash/get');
const { eachSeries } = require('async');
const createError = require('http-errors');
const util = require('util');
const aggregate = require('../../utils/aggregate');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

// const termMeterNumberId = (id, month) => `${id}-${moment(month).format('YYYY-MM')}`;
const calculateTotalUse = item => {
  if (!item.clientMeterNumbers) throw new Error('Wrong clientMeterNumber');
  let waterOffset = 0;
  if (item.histories) {
    item.histories.map(history => {
      if ('lastMeterNumber' in history) {
        waterOffset += history.oldMeterNumber - history.lastMeterNumber;
      } else {
        waterOffset += history.oldMeterNumber - history.newMeterNumber;
      }
    });
  }
  return parseInt(item.clientMeterNumbers.currentNumber - item.clientMeterNumbers.previousNumber + waterOffset);
};
// NOTE:
// duoc copy cho ham [getPriceDetails](file report-revenue-loss-client.js)
// neu co chinh sua ham [calculatePrice] thi phai sua dong thoi cho ham [getPriceDetails]
const calculatePrice = (item, total) => {
  let details = [];
  let from = 0;
  // factor value for every step in fomulas
  if (!item.formulas || !item.formulas.normGroups || item.formulas.normGroups.length <= 0)
    throw new Error('Wrong formula for client');
  const factor = item.formulas.unit === 'PERSON' ? item.memberCount || 1 : 1;
  let normGroupsIndex = 0;
  let waterFee = 0;
  while (total > from) {
    const formulaStep = item.formulas.normGroups[normGroupsIndex];
    let stepTo = formulaStep.to > 0 ? formulaStep.to : Number.MAX_SAFE_INTEGER;
    let maxWaterStep = (stepTo - formulaStep.from) * factor;

    let to = Math.min(total, from + maxWaterStep);
    let waterUsed = to - from;
    let detailStep = {
      waterUsed,
      from,
      to,
      factor,
      name: `${item.formulas.name}-${(normGroupsIndex + 1).toString()}`,
      rank: (normGroupsIndex + 1).toString(),
      price: formulaStep.price,
      toFee: parseInt(waterUsed * formulaStep.price),
    };
    waterFee += detailStep.toFee;
    details.push(detailStep);
    normGroupsIndex++;
    from = to;
  }
  let sewageFee = parseInt((item.formulas.sewageFee * waterFee) / 100);
  let taxFee = parseInt(parseFloat((item.formulas.tax * waterFee) / 100).toFixed());
  let totalFee = parseInt(waterFee + sewageFee + taxFee);
  return {
    details,
    sewagePercent: item.formulas.sewageFee,
    sewageFee,
    taxPercent: item.formulas.tax,
    taxFee,
    waterFee,
    totalFee,
    totalWaterUsed: total,
    factor: item.formulas.unit,
  };
};

// objNum: reference object, so bat dau hoa don, tang dan
// invoiceExportDate: ngay xuat hoa don
const calculateItem = async (model, invoiceExportDate, objNum, item, session) => {
  // get total water use
  let totalWaterUse = calculateTotalUse(item);
  let invoiceData = calculatePrice(item, totalWaterUse);

  // invoiceNo
  // let invoiceNo =
  //   get(item, 'clientMeterNumbers.invoiceNo', null) ||
  //   (await ClientMeterNumber.app.models.AutoIncrease.getNumber('Invoice')); // slow performance, update later // todo

  // new
  let invoiceNo = get(item, 'clientMeterNumbers.invoiceNo', null);
  if (invoiceNo === null) {
    if (objNum.invoiceNo) {
      invoiceNo = objNum.invoiceNo;
      objNum.invoiceNo = objNum.invoiceNo + 1;
    } else {
      invoiceNo = await model.app.models.AutoIncrease.getNumber('Invoice');
    }
  }

  let invoiceNoFormat = model.app.get('invoiceNoFormat') || '0000000';
  invoiceData.invoiceNo = numeral(invoiceNo).format(invoiceNoFormat);
  const {
    formattedAddress,
    name,
    type,
    memberCount,
    familyCount,
    contractNo,
    code,
    dmaId,
    buyerEmail: email,
    serial,
    taxNo,
  } = item;
  let {
    fromDate,
    toDate,
    previousNumber: oldMeterNumber,
    currentNumber: newMeterNumber,
    _id: id,
  } = item.clientMeterNumbers;

  // If there were multiple requests of meter replacement, pick the last meter number from earliest attempt
  if (item.histories.length > 0 && item.histories[0].lastMeterNumber) {
    oldMeterNumber = item.histories[0].lastMeterNumber;
  }

  return {
    id,
    invoiceNo,
    clientId: item._id,
    invoiceData: {
      ...invoiceData,
      client: { formattedAddress, name, type, memberCount, familyCount, contractNo, code, dmaId, email, serial, taxNo },
      fromDate,
      toDate,
      oldMeterNumber,
      newMeterNumber,
      invoiceExportDate,
    },
    paymentStatus: invoiceData.totalFee === 0 ? true : false,
  };
};

const aggMatch = fixIds => ({ $match: { _id: { $in: fixIds } } });

const aggPipelineNew = (subFixId, districtId, wardId, quarterId) => {
  let condition = {};
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
    { $addFields: { monthId: { $concat: [{ $convert: { input: '$_id', to: 'string' } }, subFixId] } } },
    {
      $lookup: {
        from: 'ClientMeterNumber',
        let: { monthId: '$monthId' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$monthId'] },
                  { $or: [{ $eq: ['$paymentStatus', false] }, { $eq: ['$previousNumber', '$currentNumber'] }] },
                ],
              },
            },
          },
          { $project: { invoiceNo: 1, previousNumber: 1, currentNumber: 1, fromDate: 1, toDate: 1 } },
          { $limit: 1 },
        ],
        as: 'clientMeterNumbers',
      },
    },
    { $unwind: '$clientMeterNumbers' },
    {
      $lookup: {
        from: 'Formula',
        let: { id: '$formulaId' },
        pipeline: [
          { $match: { $expr: { $and: [{ $eq: ['$_id', '$$id'] }] } } },
          { $project: { sewageFee: 1, tax: 1, unit: 1, normGroups: 1, name: 1 } },
        ],
        as: 'formulas',
      },
    },
    { $unwind: '$formulas' },
    {
      $lookup: {
        from: 'ClientMeterHistory',
        let: { id: '$_id', range: '$clientMeterNumbers' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$clientId', '$$id'] },
                  { $gte: ['$setupDate', '$$range.fromDate'] },
                  { $lt: ['$setupDate', '$$range.toDate'] },
                ],
              },
            },
          },
          { $sort: { setupDate: 1 } },
          { $project: { oldMeterNumber: 1, newMeterNumber: 1, setupDate: 1, lastMeterNumber: 1 } },
        ],
        as: 'histories',
      },
    },
  ];
};

const validateInvoiceRequestArgs = async (model, invoiceNo, termMeterNumber, ids, session) => {
  // check valid [invoiceNo]
  if (!ids.length && invoiceNo) {
    // truong hop chon mot vai record
    if (invoiceNo < 0) {
      throw createError(400, 'error.INVOICE_NO_INVALID');
    }
  }
  let clients = await getConnectorFromModel(model, 'Client')
    .find({ _id: { $in: ids.map(id => toObjectId(id)) } }, { session })
    .toArray();
  for (let i = 0; i < clients.length; i++) {
    let record = clients[i];
    let distMonth1 = moment(record.lastTimeMeterNumberUpdate)
      .startOf('month')
      .diff(moment(termMeterNumber), 'month');
    let distMonth2 = moment(termMeterNumber).diff(record.termInvoice, 'month');
    // console.log('distMonth', distMonth1, distMonth2, termMeterNumber, record);
    if (record.status === 'ACTIVE' && record.termInvoice && distMonth1 >= 0 && (distMonth2 === 0 || distMonth2 === 1)) {
      continue;
    }
    throw createError(400, 'error.DATA_INVALID_CAN_NOT_LOCK_INVOICE');
  }
};

const getInvoiceData = async ({ model, month, ids, filterValues, session }) => {
  let { invoiceNo, invoiceExportDate, districtId, wardId, quarterId } = filterValues || {};
  invoiceExportDate = invoiceExportDate ? moment(invoiceExportDate).toDate() : new Date();

  // CHECK VALID
  await validateInvoiceRequestArgs(model, invoiceNo, month, ids, session);

  let subFixId = moment(month).format('-YYYY-MM');

  //da thanh toan?
  if (ids && ids.length > 0) {
    let fixIds = ids.map(id => `${id}${subFixId}`);
    let count = await getConnectorFromModel(model).find(
      { _id: { $in: fixIds }, paymentStatus: true, $expr: { $ne: ['$previousNumber', '$currentNumber'] } },
      { session },
    );

    if (count.length > 0) {
      throw createError(400, 'error.PAID_CAN_NOT_LOCK_INVOICE');
    }
  }
  // build aggregation pipeline to get data
  let dataQuery = aggPipelineNew(subFixId, districtId, wardId, quarterId);
  // in case limits ids for calculate
  if (ids && ids.length > 0) {
    let fixIds = ids.map(id => toObjectId(id));
    // clone from match template
    let dataMatch = aggMatch(fixIds);
    dataQuery.unshift(dataMatch);
  }
  let sourceData = await aggregate(model.app.models.Client, dataQuery, session);

  let invoiceDatas = [];
  let objNumber = { invoiceNo };
  await util.promisify(eachSeries)(sourceData, async item => {
    // console.log('==>foreach item', item);
    let dataItem = await calculateItem(model, invoiceExportDate, objNumber, item, session);
    invoiceDatas.push(dataItem);
  });

  return invoiceDatas;
};

module.exports = {
  aggMatch,
  aggPipelineNew,
  calculateTotalUse,
  calculateItem,
  calculatePrice,
  validateInvoiceRequestArgs,
  getInvoiceData,
};
