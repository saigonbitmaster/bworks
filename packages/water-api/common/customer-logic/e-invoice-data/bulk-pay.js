'use strict';
const path = require('path');
const xlsx = require('xlsx');
const objectHash = require('object-hash');
const httpError = require('http-errors');
const get = require('lodash/get');
const set = require('lodash/set');
const isEmpty = require('lodash/isEmpty');
const pickBy = require('lodash/pickBy');
const toLower = require('lodash/toLower');
const sortObjectByKey = require('../../utils/sort-object-by-key');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const Transaction = require('../../utils/transaction');
const toObjectId = require('../../utils/to-object-id');

module.exports = EinvoiceData => {
  EinvoiceData.bulkPay = async filename => {
    const uploadedExcelDir = EinvoiceData.app.dirs.tempSheet.uploaded;
    const filepath = path.resolve(uploadedExcelDir, filename);

    // Get data from uploaded template, first sheet only
    const paymentFileObject = xlsx.readFile(filepath, {
      cellDates: true,
    });
    const paymentFirstSheet = paymentFileObject.Sheets[paymentFileObject.SheetNames[0]];
    if (!paymentFirstSheet) {
      throw httpError(400, 'error.DATA_NOT_FOUND');
    }
    const cellIndices = Object.keys(paymentFirstSheet).filter(
      index =>
        index.match(/[0-9]+/) &&
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].includes(index.match(/([A-Z]+)/)[1]) &&
        parseInt(index.match(/([0-9]+)$/)[1], 10) > 6,
    );
    const paymentData = sortObjectByKey(
      cellIndices.reduce((acc, val) => ({ ...acc, [val]: get(paymentFirstSheet, `${val}.v`) }), {}),
    );
    const predefinedPaymentData = pickBy(paymentData, (_, key) => !key.startsWith('H'));
    if (isEmpty(predefinedPaymentData)) {
      throw httpError(400, 'error.EMPTY_TEMPLATE');
    }
    // const paymentDataHash = objectHash(predefinedPaymentData);

    // Validate populated data with hash
    // const storedChecksum = await EinvoiceData.app.models.ImportActivityLog.findById(paymentDataHash);
    // if (!storedChecksum) {
    //   throw httpError(400, 'error.MODIFIED_REF_DATA_OR_UNKNOWN_ORIGIN_TEMPLATE');
    // }

    // Get invoce ids of records marked to be 'paid' by admin
    const invoiceIds = [];
    const payMarks = pickBy(paymentData, (_, key) => key.startsWith('H'));
    const payMarkWithIndex = Object.entries(payMarks);
    for (const [cellIndex, payMark] of payMarkWithIndex) {
      if (toLower(payMark) === 'x') {
        const index = cellIndex.match(/([0-9]+)$/)[1];
        const invoiceId = get(paymentData, `G${index}`);
        if (invoiceId) {
          invoiceIds.push(invoiceId);
        }
      }
    }
    // Perform bulk update of payment status
    const rawEinvoiceDataModel = getConnectorFromModel(EinvoiceData);
    const rawClientMeterNumberModel = getConnectorFromModel(EinvoiceData, 'ClientMeterNumber');
    const rawClient = getConnectorFromModel(EinvoiceData, 'Client');
    const transaction = new Transaction(EinvoiceData);
    const session = transaction.start();

    try {
      const arrayedResults = await rawEinvoiceDataModel
        .find(
          {
            eInvoiceNo: { $in: invoiceIds },
          },
          { projection: { 'clientMeterNumberItem._id': 1, 'clientMeterNumberItem.clientId': 1 }, session },
        )
        .toArray();
      const invoiceData = { meterNumberIds: [], clientIds: [] };
      if (arrayedResults) {
        set(
          invoiceData,
          'meterNumberIds',
          arrayedResults.map(invoice => get(invoice, 'clientMeterNumberItem._id')),
        );
        set(
          invoiceData,
          'clientIds',
          arrayedResults.map(invoice => get(invoice, 'clientMeterNumberItem.clientId')),
        );
      }
      const { modifiedCount } = await rawClientMeterNumberModel.updateMany(
        { _id: { $in: invoiceData.meterNumberIds } },
        { $set: { paymentStatus: true } },
        { session },
      );
      const clientsWithNoDebt = await rawClient.updateMany(
        { _id: { $in: invoiceData.clientIds.map(id => toObjectId(id)) } },
        { $set: { debt: 0 } },
        { session },
      );
      if (modifiedCount === clientsWithNoDebt.modifiedCount) {
        await transaction.commit();
      }
      const result = {};
      if (modifiedCount === 0 || clientsWithNoDebt.modifiedCount === 0) {
        set(result, 'message', 'notification.data.noneToSave');
      }
      return result;
    } catch (err) {
      await transaction.rollback();
    }
  };

  EinvoiceData.remoteMethod('bulkPay', {
    accepts: [
      { arg: 'filename', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'returned', type: 'object', root: true },
  });
};
