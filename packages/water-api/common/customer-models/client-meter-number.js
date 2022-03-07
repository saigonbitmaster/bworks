'use strict';
const error = require('../../i18n/vi/error');

module.exports = function(ClientMeterNumber) {
  function validateClient(err, done) {
    const clientId = this.clientId;
    const Client = ClientMeterNumber.app.models.Client;

    if (clientId) {
      Client.findById(clientId, (error, instance) => {
        if (!instance) err();
        done();
      });
    }
  }
  ClientMeterNumber.validateAsync('clientId', validateClient, { message: error.NON_EXISTENT_DATA });

  function validatePreviousClientMeterNumber(err) {
    const previousMeterNumberId = this.previousMeterNumberId;

    if (previousMeterNumberId) {
      ClientMeterNumber.findById(previousMeterNumberId, (error, instance) => {
        if (error) err();
        if (!instance) err();
      });
    }
  }
  ClientMeterNumber.validate('previousMeterNumberId', validatePreviousClientMeterNumber, {
    message: error.NON_EXISTENT_DATA,
  });
};
