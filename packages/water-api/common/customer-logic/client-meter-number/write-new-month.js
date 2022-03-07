'use strict';
const moment = require('moment-timezone');
const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const Transaction = require('../../utils/transaction');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.writeNewMonth = async (data, options, transaction, session) => {
    let Client = ClientMeterNumber.app.models.Client;
    const { clientId, currentNumber: tempCurr, previousNumber: tempPrevious, toDate, fromDate, images } = data;
    const nextMonth = moment(fromDate).add(1, 'month');
    const currentNumber = parseInt(tempCurr, 10);
    const previousNumber = parseInt(tempPrevious, 10);
    if (
      !clientId ||
      !fromDate ||
      isNaN(currentNumber) ||
      isNaN(previousNumber) ||
      !moment(fromDate).isBefore(toDate, 'month') ||
      !moment(toDate).isBetween(moment(nextMonth).startOf('month'), moment(nextMonth).endOf('month'), null, '[]')
    ) {
      throw createError(400, 'error.DATA_INVALID');
    }

    // check last ClientMeterNumber
    let lastWrite = await ClientMeterNumber.findOne({ where: { clientId }, order: 'toDate DESC' });
    if (lastWrite && !moment(lastWrite.toDate).isSame(fromDate, 'month')) {
      throw createError(400, 'error.DATA_INVALID'); // next month = pre + 1
    }
    // check meter change
    let history = await ClientMeterNumber.app.models.ClientMeterHistory.findOne({
      where: { clientId, setupDate: { between: [fromDate, toDate] } },
      order: 'setupDate DESC',
    });
    if ((!history && currentNumber < previousNumber) || (history && currentNumber < history.newMeterNumber)) {
      throw createError(400, 'error.DATA_INVALID');
    }
    // check client
    let client = await Client.findById(clientId);
    if (!client) {
      throw createError(400, 'error.CLIENT_NOT_EXIST');
    }
    if (client.status !== 'ACTIVE') {
      throw createError(400, 'error.CLIENT_NOT_ACTIVE');
    }
    // Check for existing written meter number
    // Emit error if app user wrote meter number on web, on each record (no passing arguments of transaction and session)
    // Skip errors if app user wrote meter number by uploading Excel files
    const existingMeterNumber = await ClientMeterNumber.findById(data.id);
    if (existingMeterNumber) {
      if (!transaction || !session) {
        throw createError(400, 'error.DUPLICATE_METER_NUMBER');
      } else {
        return;
      }
    }

    // Check if clients has edited reference data
    if (data.code && data.name && data.formattedAddress) {
      if (data.code !== client.code || data.name !== client.name || data.formattedAddress !== client.formattedAddress) {
        throw createError(400, 'error.REF_DATA_HAS_BEEN_MODIFIED');
      }
    }
    let clientUpdate = {
      lastMeterNumber: currentNumber,
      lastTimeMeterNumberUpdate: moment(toDate).toDate(),
      termMeterNumber: moment(toDate)
        .startOf('month')
        .toDate(),
    };

    clientUpdate = await operationMeta({ data: clientUpdate, options });
    data = await operationMeta({ data, options });

    // Wrap write ops in transaction
    let passingSession = true;
    if (!transaction || !session) {
      transaction = new Transaction(ClientMeterNumber);
      session = transaction.start();
      passingSession = false;
    }

    try {
      await getConnectorFromModel(Client).updateOne({ _id: toObjectId(clientId) }, { $set: clientUpdate }, { session });

      // Preprocess data to be saved
      data.fromDate = moment(data.fromDate).toDate();
      data.toDate = moment(data.toDate).toDate();
      data._id = data.id;
      data.clientId = toObjectId(clientId);
      data.paymentStatus = false;
      if (data.images) {
        data.images = images;
      }
      delete data.id;
      delete data.code;
      delete data.name;
      delete data.formattedAddress;

      const createdMeterNumber = await getConnectorFromModel(ClientMeterNumber).insertOne(data, { session });

      // Charge immediately when client did not use water this month
      // if (data.previousNumber === data.currentNumber) {
      //   await ClientMeterNumber.calculateInvoicesInternal({
      //     month: data.toDate,
      //     ids: [data.clientId],
      //     filterValues: {},
      //     session,
      //     transaction,
      //   });
      // }

      // calculate
      await ClientMeterNumber.calculateInvoicesInternal({
        month: toDate,
        ids: [data.clientId],
        filterValues: {},
        session,
        transaction,
      });

      if (!passingSession) {
        await transaction.commit();
      }

      return createdMeterNumber.ops[0];
    } catch (error) {
      if (!passingSession) {
        await transaction.rollback();
      }
      throw error;
    }
  };

  ClientMeterNumber.remoteMethod('writeNewMonth', {
    accepts: [
      { arg: 'data', type: 'object', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
