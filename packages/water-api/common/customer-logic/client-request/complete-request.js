'use strict';
const moment = require('moment-timezone');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const createError = require('http-errors');
const toObjectId = require('../../utils/to-object-id');
const Transaction = require('../../utils/transaction');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = function(ClientRequest) {
  ClientRequest.completeRequest = async (data, options, transaction, session) => {
    // check valid serial
    // if (data.serial) {
    //   let res = await ClientRequest.app.models.Client.find({ where: { serial: data.serial } });
    //   if (res && res.length) {
    //     throw createError(400, 'error.DUPLICATE_SERIAL');
    //   }
    // }

    let passingSession = true;
    if (!transaction || !session) {
      transaction = new Transaction(ClientRequest);
      session = transaction.start();
      passingSession = false;
    }

    try {
      data.status = 'COMPLETE';
      let clientMeterHistory = null;

      const rawClientRegister = getConnectorFromModel(ClientRequest, 'ClientRegister');
      const rawClient = getConnectorFromModel(ClientRequest, 'Client');
      const rawClientRequest = getConnectorFromModel(ClientRequest);
      const rawClientMeterNumber = getConnectorFromModel(ClientRequest, 'ClientMeterNumber');
      const rawClientMeter = getConnectorFromModel(ClientRequest, 'ClientMeter');
      const rawClientMeterHistory = getConnectorFromModel(ClientRequest, 'ClientMeterHistory');

      if (data.type === 'NEW_INSTALL') {
        await rawClientRegister.findOneAndUpdate(
          { clientId: toObjectId(data.clientId) },
          { $set: { status: 'COMPLETE' } },
          { session },
        );

        // update client meter history
        clientMeterHistory = {
          type: data.type,
          oldMeterNumber: data.startMeterNumber,
          newMeterNumber: data.startMeterNumber,
          clientId: toObjectId(data.clientId),
          setupDate: moment(data.setupDate).toDate(),
          meterId: toObjectId(data.meterId),
        };
        let setupMonth = moment(data.setupDate)
          .startOf('month')
          .toDate();

        // update client
        await rawClient.findOneAndUpdate(
          { _id: toObjectId(data.clientId) },
          {
            $set: {
              status: 'ACTIVE',
              termInvoice: data.termInvoice ? data.termInvoice : setupMonth, // month to start calculate invoice
              termMeterNumber: data.termMeterNumber ? data.termMeterNumber : setupMonth, // month to start write meter number
              lastMeterNumber: data.startMeterNumber, // last meter number of client
              startMeterDate: data.setupDate ? moment(data.setupDate).toDate() : moment(setupMonth).toDate(),
              activeRequests: [],
              lastTimeMeterNumberUpdate: data.lastTimeMeterNumberUpdate
                ? data.lastTimeMeterNumberUpdate
                : moment(data.setupDate).toDate(),
              serial: data.serial,
            },
          },
          { returnOriginal: false, session },
        );
      }

      if (data.type === 'REPLACE') {
        // check valid
        // thoi gian thay dong ho > thoi gian ghi nuoc cuoi cung
        const lastWrite = await rawClientMeterNumber
          .find({ clientId: toObjectId(data.clientId) }, { session })
          .sort({ toDate: -1 })
          .limit(1)
          .toArray();
        // If user hasn't written new meter number, the last meter number saved in corresponding Client record is the one
        // the client has registered during the completion of new meter number
        const initialMeterNumber = await rawClient.findOne({ _id: toObjectId(data.clientId) }, { session });

        if (lastWrite.length > 0) {
          let { currentNumber, toDate } = lastWrite[0];
          if (data.oldMeterNumber < currentNumber) {
            throw createError(400, 'error.REPLACE_METER_OLDMETERNUMBER_GREATE_CURRENTNUMBER');
          }
          if (moment(data.setupDate).isBefore(moment(toDate))) {
            throw createError(400, 'error.REPLACE_METER_SETUPDATE_GREATE_TODATE');
          }
        }

        if (initialMeterNumber) {
          const { lastMeterNumber, startMeterDate } = initialMeterNumber;
          if (data.oldMeterNumber < lastMeterNumber) {
            throw createError(400, 'error.REPLACE_METER_OLDMETERNUMBER_GREATE_CURRENTNUMBER');
          }
          if (moment(data.setupDate).isBefore(moment(startMeterDate))) {
            throw createError(400, 'error.REPLACE_METER_SETUPDATE_GREATE_TODATE');
          }
        }

        clientMeterHistory = {
          type: data.type,
          lastMeterNumber: data.lastMeterNumber,
          oldMeterNumber: data.oldMeterNumber,
          newMeterNumber: data.newMeterNumber,
          clientId: toObjectId(data.clientId),
          setupDate: moment(data.setupDate).toDate(),
        };
        await rawClient.updateOne(
          { _id: toObjectId(data.clientId) },
          {
            $set: {
              status: 'ACTIVE',
              activeRequests: [],
              serial: data.serial,
              lastMeterNumber: data.newMeterNumber,
            },
          },
          { session },
        );
      }

      // Assure uniqueness of input QR code
      if (data.qrCode) {
        const existingQrCodesInClientMeter = await rawClientMeter.countDocuments(
          { qrCode: data.qrCode, clientId: { $ne: toObjectId(data.clientId) } },
          { session },
        );
        if (existingQrCodesInClientMeter > 0) {
          throw createError(400, 'error.QR_CODE_EXISTED');
        }
      }

      // Update clientmeter
      await rawClientMeter.updateOne(
        { clientId: toObjectId(data.clientId) },
        {
          $set: {
            setupDate: moment(data.setupDate).toDate(),
            serial: data.serial,
            qrCode: data.qrCode,
            installationTeamId: toObjectId(data.installationTeamId),
            rootMeterId: toObjectId(data.rootMeterId),
            startMeterNumber: data.newMeterNumber || 0,
          },
        },
        { session },
      );

      await rawClientMeterHistory.insertOne(clientMeterHistory, { session });

      const metaOperationalData = await operationMeta({ data, options });
      const record = await rawClientRequest.findOneAndUpdate(
        { clientId: toObjectId(data.clientId) },
        {
          $set: {
            updaterId: toObjectId(metaOperationalData.updaterId),
            updatedDate: metaOperationalData.updatedDate,
          },
        },
        { session },
      );
      if (!passingSession) {
        await transaction.commit();
      }
      return record.value;
    } catch (error) {
      if (!passingSession) {
        await transaction.rollback();
      }
      throw error;
    }
  };
  ClientRequest.remoteMethod('completeRequest', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
