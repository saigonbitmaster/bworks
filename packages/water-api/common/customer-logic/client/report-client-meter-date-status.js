'use strict';
const util = require('util');
const createError = require('http-errors');
const moment = require('moment');

module.exports = Client => {
  Client.afterRemote('find', async ctx => {
    for (let i = 0; i < ctx.result.length; i++) {
      const result = ctx.result[i];
      ctx.result[i]['meterDateStatus'] = await Client.reportClientMeterDateStatus(result.id.toString());
    }
    return;
  });

  Client.reportClientMeterDateStatus = async clientId => {
    // Get period of expiration [DONE]
    // Get period of near expiration [DONE]
    try {
      let meterLifeSpan = await Client.app.models.CtmConfig.findById('StatisticMatLifeSpan');
      meterLifeSpan = meterLifeSpan.toJSON();
      // Get client [DONE]
      let client = await Client.findById(clientId);
      // Get client meter setupDate [DONE]
      let clientMeter = await util.promisify(client.meter)();
      if (!clientMeter) {
        return 'hasNoMeter';
      }
      // Calculate timestamps for a water meter to be near-expired and expired [DONE]
      const clientMeterSetupDate = clientMeter.toJSON().setupDate;
      const nearExpirationTimestamp = moment(clientMeterSetupDate).add(meterLifeSpan.value.lessTime.value, 'months');
      const expirationTimestamp = moment(clientMeterSetupDate).add(meterLifeSpan.value.existTime.value, 'months');
      const currentTimestamp = moment();
      // Compare client's meter setup date against said two [DONE]
      // Return result [DONE]
      if (currentTimestamp.isBefore(nearExpirationTimestamp)) {
        return 'valid';
      } else {
        if (currentTimestamp.isBefore(expirationTimestamp)) {
          return 'nearExpired';
        } else {
          return 'expired';
        }
      }
    } catch (err) {
      throw createError(500, 'NON_EXISTENT_DATA');
    }
  };
};
