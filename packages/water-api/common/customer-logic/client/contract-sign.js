'use strict';
const createError = require('http-errors');
const pick = require('lodash/pick');
const toObjectId = require('../../utils/to-object-id');
const moment = require('moment-timezone');
const Transaction = require('../../utils/transaction');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = Client => {
  Client.contractSign = async (data, transaction, session) => {
    let passingSession = true;
    if (!session || !transaction) {
      transaction = new Transaction(Client);
      session = transaction.start();
      passingSession = false;
    }

    const rawClientModel = getConnectorFromModel(Client);
    const rawClientRegisterModel = getConnectorFromModel(Client, 'ClientRegister');

    try {
      let { code, contractNo, taxNo, id, clientRegisterId } = data;
      let records = [];
      if (code) {
        records = await rawClientModel.countDocuments({ code }, { session });
        if (records > 0) {
          throw createError(400, 'error.DUPLICATE_CODE');
        }
      }

      if (contractNo) {
        records = await rawClientModel.countDocuments({ contractNo }, { session });
        if (records > 0) {
          throw createError(400, 'error.DUPLICATE_CONTRACT_NO');
        }
      }

      if (taxNo) {
        records = await rawClientModel.countDocuments({ taxNo }, { session });
        if (records > 0) {
          throw createError(400, 'error.DUPLICATE_TAX_NO');
        }
      }

      // Retrieve defined fields of Client model before creating one
      const dataWithClientFields = pick(data, Object.keys(Client.definition.properties));
      // Modify Id-like values to native Mongo format
      dataWithClientFields.provinceId = toObjectId(dataWithClientFields.provinceId);
      dataWithClientFields.districtId = toObjectId(dataWithClientFields.districtId);
      dataWithClientFields.wardId = toObjectId(dataWithClientFields.wardId);
      dataWithClientFields.formulaId = toObjectId(dataWithClientFields.formulaId);
      if (dataWithClientFields.quarterId) {
        dataWithClientFields.quarterId = toObjectId(dataWithClientFields.quarterId);
      }
      // Parse family count and member count back to int
      dataWithClientFields.memberCount = parseInt(dataWithClientFields.memberCount, 10);
      dataWithClientFields.familyCount = parseInt(dataWithClientFields.familyCount, 10);
      // Modify geodata to Mongo native form
      if (
        'position' in dataWithClientFields &&
        dataWithClientFields.position &&
        dataWithClientFields.position.lng &&
        dataWithClientFields.position.lat
      ) {
        dataWithClientFields.position = {
          type: 'Point',
          coordinates: [dataWithClientFields.position.lng, dataWithClientFields.position.lat],
        };
      }
      // Wrap Date-like value in Date object
      dataWithClientFields.contractDate = moment(dataWithClientFields.contractDate).toDate();
      if (!dataWithClientFields.contractStatus) {
        dataWithClientFields.contractStatus = 'ACTIVE';
      }
      // Delete the `id` field as it belongs to ClientRegister model
      delete dataWithClientFields['id'];

      // clientRegisterId only present when trigger the bulk import of client from Excel sheets
      // Normally, it's the id created in the webpage of clientRegister that present
      const finalId = clientRegisterId ? clientRegisterId : id;
      // create new client
      const record = await rawClientModel.insertOne(dataWithClientFields, { session });
      // update clientRegister
      await rawClientRegisterModel.findOneAndUpdate(
        { _id: toObjectId(finalId) },
        {
          $set: {
            clientId: toObjectId(record.insertedId),
            status: 'CONTRACT_SIGNED',
          },
        },
        { session },
      );
      if (!passingSession) {
        await transaction.commit();
      }
      return record.ops[0];
    } catch (error) {
      if (!passingSession) {
        await transaction.rollback();
      }
      if (error.message.indexOf('error.') === 0) {
        throw error;
      } else {
        throw createError(400, 'error.UNKNOWN');
      }
    }
  };
  Client.remoteMethod('contractSign', {
    accepts: [{ arg: 'data', type: 'object' }],
    returns: { arg: 'data', root: 'true', type: 'object' },
  });
};
