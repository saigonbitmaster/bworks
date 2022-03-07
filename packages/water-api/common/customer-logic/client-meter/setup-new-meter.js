// const createError = require('http-errors');
const Transaction = require('../../utils/transaction');
const moment = require('moment-timezone');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const toObjectId = require('../../utils/to-object-id');

module.exports = function(ClientMeter) {
  ClientMeter.setupNewMeter = async (data, options) => {
    // check valid serial
    // if (data.serial) {
    //   let res = await ClientMeter.app.models.Client.find({ where: { serial: data.serial } });
    //   if (res && res.length) {
    //     throw createError(400, 'error.DUPLICATE_SERIAL');
    //   }
    // }

    const transaction = new Transaction(ClientMeter);
    const session = transaction.start();

    try {
      // Remove id from data to be inserted
      delete data.id;
      // Convert Id-like value to native Mongo form
      data.providerId = toObjectId(data.providerId);
      data.installationTeamId = toObjectId(data.installationTeamId);
      data.clientId = toObjectId(data.clientId);
      if (data.rootMeterId) {
        data.rootMeterId = toObjectId(data.rootMeterId);
      }
      const record = await getConnectorFromModel(ClientMeter).insertOne(data, { session });

      // Update referred clienClientMeter.id is the same with Client.it
      // Update provider and dma data
      await getConnectorFromModel(ClientMeter, 'Client').findOneAndUpdate(
        {
          _id: toObjectId(data.clientId),
        },
        {
          $set: {
            meterId: toObjectId(record.insertedId),
            providerId: toObjectId(data.providerId),
            dmaId: toObjectId(data.dmaId),
          },
        },
        { session },
      );

      const clientRequest = {
        clientId: toObjectId(data.clientId),
        installTeam: data.installTeam || undefined,
        installationTeamId: toObjectId(data.installationTeamId),
        setupDate: moment(data.setupDate).toDate(),
        status: 'NEW',
        title: 'Setup Meter',
        qrCode: data.qrCode,
        serial: data.serial,
        type: 'NEW_INSTALL',
      };
      // delete uncompleted request for this client
      await ClientMeter.app.models.ClientRequest.createRequest(clientRequest, options, session);
      await transaction.commit();
      return record.ops && record.ops.length > 0 ? record.ops[0] : {};
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  ClientMeter.remoteMethod('setupNewMeter', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
