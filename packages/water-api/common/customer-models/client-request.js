'use strict';
const error = require('../../i18n/vi/error');

module.exports = function(ClientRequest) {
  function validateClient(err) {
    const clientId = this.clientId;
    const Client = ClientRequest.app.models.Client;

    if (clientId) {
      Client.findById(clientId, (error, instance) => {
        if (error) err();
        if (!instance) err();
      });
    }
  }

  function validateInstallationTeam(err) {
    const installationTeamId = this.installationTeamId;
    const InstallationTeam = ClientRequest.app.models.InstallationTeam;

    if (installationTeamId) {
      InstallationTeam.findById(installationTeamId, (error, instance) => {
        if (error) err();
        if (!instance) err();
      });
    }
  }

  ClientRequest.validate('clientId', validateClient, { message: error.NON_EXISTENT_DATA });
  ClientRequest.validate('installationTeamId', validateInstallationTeam, { message: error.NON_EXISTENT_DATA });
  // ClientRequest.validatesPresenceOf('title', { message: error.REQUIRED_DATA_NOT_EXIST });
  ClientRequest.validatesNumericalityOf('startMeterNumber', {
    allowBlank: true,
    allowNull: true,
    message: error.DATA_IS_NOT_NUMERIC,
  });
  ClientRequest.validatesNumericalityOf('oldMeterNumber', {
    allowBlank: true,
    allowNull: true,
    message: error.DATA_IS_NOT_NUMERIC,
  });
  ClientRequest.validatesNumericalityOf('newMeterNumber', {
    allowBlank: true,
    allowNull: true,
    message: error.DATA_IS_NOT_NUMERIC,
  });
  ClientRequest.validatesInclusionOf('type', { in: ['NEW_INSTALL', 'REPLACE'], message: error.INVALID_DATA });
  ClientRequest.validatesInclusionOf('status', {
    in: ['NEW', 'INPROCESS', 'PENDING', 'COMPLETE'],
    message: error.INVALID_DATA,
  });
};
