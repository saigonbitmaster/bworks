'use strict';
const util = require('util');
const moment = require('moment-timezone');
const isPlainObject = require('lodash/isPlainObject');
const eachLimit = util.promisify(require('async/eachLimit'));
const Transaction = require('../../utils/transaction');
const toObjectId = require('../../utils/to-object-id');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.fillZeroVolume = async (month, ids, filterValues, options) => {
    const Client = ClientMeterNumber.app.models.Client;
    let fixFilterValues = Object.assign({}, filterValues);
    // add condition
    if (ids && ids.length) {
      fixFilterValues.id = { $in: ids };
    }

    fixFilterValues.status = 'ACTIVE';
    fixFilterValues.termMeterNumber = moment(month)
      .subtract(1, 'month')
      .startOf('month')
      .toDate();

    // Begin transaction
    const transaction = new Transaction(Client);
    const session = transaction.start();

    try {
      let selectedFilterValues = {};
      if (fixFilterValues.and) {
        selectedFilterValues = fixFilterValues.and.reduce((acc, val) => {
          if (isPlainObject(val)) {
            for (let [k, v] of Object.entries(val)) {
              if (k.match(/id$/i)) {
                v = toObjectId(v);
              }
              if (v.lt) {
                v.$lt = moment(v.lt).toDate();
                delete v.lt;
              }
              acc[k] = v;
            }
          }
          return acc;
        }, {});
        delete fixFilterValues.and;
      }
      fixFilterValues = Object.assign(fixFilterValues, selectedFilterValues);
      const clients = await getConnectorFromModel(Client)
        .find(fixFilterValues, { limit: 100, session })
        .toArray();
      let result = 0;
      if (clients && clients.length) {
        await eachLimit(clients, 10, async client => {
          const data = await ClientMeterNumber.getDefaultNewMonth(client._id, month);
          data.clientId = client._id;
          data.currentNumber = client.lastMeterNumber;
          data.previousNumber = client.lastMeterNumber;
          data.fromDate = client.lastTimeMeterNumberUpdate;
          data.toDate = moment(client.lastTimeMeterNumberUpdate)
            .add(1, 'month')
            .toDate();
          await ClientMeterNumber.writeNewMonth(data, options, transaction, session);
          result++;
        });
      }
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  ClientMeterNumber.remoteMethod('fillZeroVolume', {
    accepts: [
      { arg: 'month', type: 'date', required: true },
      { arg: 'ids', type: ['string'] },
      { arg: 'filterValues', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'number', root: true },
  });
};
