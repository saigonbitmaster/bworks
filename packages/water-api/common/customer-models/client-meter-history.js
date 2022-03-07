const updateClient = require('../customer-logic/client-meter-history/update-client');
const error = require('../../i18n/vi/error');
const moment = require('moment-timezone');
const { isEmpty } = require('lodash');

module.exports = ClientMeterHistory => {
  ClientMeterHistory.checkClientMeterHaveChange = async (clientId, fromDate, toDate) => {
    const currentClientMeterHistory = await ClientMeterHistory.find({ where: { clientId } });
    const changedClientMeter = currentClientMeterHistory.filter(history => {
      const { setupDate } = history;
      return moment(setupDate).isBetween(fromDate, toDate);
    });
    return { changedClientMeter, isChanged: !isEmpty(changedClientMeter) };
  };

  updateClient(ClientMeterHistory);
  function validateClient(err, done) {
    const clientId = this.clientId;
    const Client = ClientMeterHistory.app.models.Client;

    if (clientId) {
      Client.findById(clientId, (error, instance) => {
        if (!instance) err();
        done();
      });
    } else {
      done();
    }
  }
  ClientMeterHistory.validateAsync('clientId', validateClient, { message: error.NON_EXISTENT_DATA });
  ClientMeterHistory.validatesPresenceOf('oldMeterNumber', { err: error.REQUIRED_DATA_NOT_EXIST });
  ClientMeterHistory.validatesNumericalityOf('oldMeterNumber', { err: error.DATA_IS_NOT_NUMERIC });
  ClientMeterHistory.validatesNumericalityOf('newMeterNumber', { err: error.DATA_IS_NOT_NUMERIC });
  ClientMeterHistory.validatesPresenceOf('newMeterNumber', { err: error.REQUIRED_DATA_NOT_EXIST });
  ClientMeterHistory.validatesPresenceOf('setupDate', { err: error.REQUIRED_DATA_NOT_EXIST });
  ClientMeterHistory.validatesInclusionOf('type', { in: ['NEW_INSTALL', 'REPLACE'], err: error.INVALID_DATA });
};
