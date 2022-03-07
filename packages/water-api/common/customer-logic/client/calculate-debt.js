'use strict';
const differenceBy = require('lodash/differenceBy');
const toString = require('lodash/toString');
const eachSeries = require('util').promisify(require('async/eachSeries'));
const aggregate = require('../../utils/aggregate');
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const toObjectId = require('../../utils/to-object-id');

module.exports = Client => {
  Client.calculateDebt = async (ids, session) => {
    const result = {};
    const clientCollection = getConnectorFromModel(Client);

    // save to client
    const aggQuery = getQuery(ids);
    const clientDebts = await aggregate(Client.app.models.ClientMeterNumber, aggQuery, session);
    if (clientDebts) {
      let fullIds = [];
      await eachSeries(clientDebts, async item => {
        fullIds = fullIds.concat(item.ids);
        // update data
        await clientCollection.updateMany(
          { _id: { $in: item.ids.map(id => toObjectId(id)) } },
          { $set: { debt: item._id } },
          { session },
        );
        result[item._id] = item.ids.length;
      });

      // update to 0
      let condition = null;
      if (ids && ids.length) {
        let fixIds = differenceBy(ids, fullIds, toString);
        if (fixIds && fixIds.length) {
          condition = { _id: { $in: fixIds.map(id => toObjectId(id)) } };
        }
      } else {
        condition = { _id: { $nin: fullIds.map(id => toObjectId(id)) } };
      }

      let clientNoDebt = null;
      if (condition) {
        clientNoDebt = await clientCollection.updateMany(condition, { $set: { debt: 0 } }, { session });
      }
      if (clientNoDebt && clientNoDebt.modifiedCount > 0) {
        result[0] = clientNoDebt.modifiedCount;
      } else {
        result[0] = 0;
      }
    }
    return result;
  };
};

const getQuery = ids => {
  let fixIds = ids.map(id => toObjectId(id));
  let rawQuery = [
    { $match: { paymentStatus: false, invoiceData: { $exists: true }, clientId: { $in: fixIds } } },
    { $group: { _id: '$clientId', debt: { $sum: 1 } } },
    { $group: { _id: '$debt', ids: { $push: '$_id' } } },
  ];
  if (!ids || ids.length <= 0) {
    delete rawQuery[0].$match.clientId;
  }
  return rawQuery;
};
