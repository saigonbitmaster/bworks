'use strict';
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const createError = require('http-errors');
const moment = require('moment-timezone');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = function(ClientRequest) {
  ClientRequest.createRequest = async (data, options, session) => {
    const rawClientRequest = getConnectorFromModel(ClientRequest);
    const rawClientMeter = getConnectorFromModel(ClientRequest, 'ClientMeter');

    await rawClientRequest.deleteMany({
      clientId: toObjectId(data.clientId),
      status: { neq: 'COMPLETE' },
    });

    data.status = 'NEW';
    data.startMeterDate = data.setupDate;
    data.inUse = true;

    // Handle case of new client
    if (data.type === 'NEW_INSTALL') {
      // update status client register
      const clientRegister = await getConnectorFromModel(ClientRequest, 'ClientRegister').findOneAndUpdate(
        { clientId: toObjectId(data.clientId) },
        { $set: { status: 'INSTALL_WAITING' } },
        { returnOriginal: false, session },
      );
      if (!clientRegister.value) throw new Error('Client Register Not Found!');

      // update status client
      // client = await ClientRequest.app.models.Client.findOne({
      //   where: { id: data.clientId, status: { neq: 'COMPLETE' } },
      // });
      // if (!client) throw new Error('Client not found!');
      // client.status = 'INSTALL_WAITING';
      // await client.save();
      // update client
    } else if (data.type === 'REPLACE') {
      // Do nothing
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

    if (data.setupDate) data.setupDate = moment(data.setupDate).toDate();
    if (data.startMeterDate) data.startMeterDate = moment(data.startMeterDate).toDate();
    if (data.clientId) data.clientId = toObjectId(data.clientId);
    if (data.rootMeterId) data.rootMeterId = toObjectId(data.rootMeterId);
    if (data.installationTeamId) data.installationTeamId = toObjectId(data.installationTeamId);
    const metaOperationalData = await operationMeta({ data, options });

    const result = await rawClientRequest.insertOne(metaOperationalData, { session });
    // const result = await ClientRequest.create(metaOperationalData);

    // if (!client) {
    //   client = await ClientRequest.app.models.Client.findById(data.clientId);
    //   if (!client) {
    //     throw new Error('Client Register Not Found!');
    //   }
    // }

    // update status client
    let updatedClientInfo = { status: 'INSTALL_WAITING' };

    // show list request
    if (result.insertedId) {
      updatedClientInfo.activeRequests = [toObjectId(result.insertedId)];
    }
    updatedClientInfo = await operationMeta({ data: updatedClientInfo, options });
    const client = await getConnectorFromModel(ClientRequest, 'Client').findOneAndUpdate(
      { _id: toObjectId(data.clientId) },
      { $set: updatedClientInfo },
      { session },
    );
    if (!client.value) throw createError(400, 'error.CLIENT_NOT_EXIST');

    return result.insertedId;
  };
};
