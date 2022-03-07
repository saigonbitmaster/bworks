'use strict';
const error = require('../../i18n/vi/error');
// eslint-disable-next-line no-unused-vars
module.exports = function(ClientMeter) {
  // Ensure uniqueness of QR code for each meter
  ClientMeter.validatesUniquenessOf('qrCode');

  function validateInstallationTeam(err, done) {
    const installationTeamId = this.installationTeamId;
    const InstallationTeam = ClientMeter.app.models.InstallationTeam;

    if (installationTeamId) {
      InstallationTeam.findById(installationTeamId, (error, instance) => {
        if (!instance) err();
        done();
      });
    } else {
      done();
    }
  }
  ClientMeter.validateAsync('installationTeamId', validateInstallationTeam, { message: error.NON_EXISTENT_DATA });

  function validateRootMeter(err, done) {
    const rootMeterId = this.rootMeterId;
    const RootMeter = ClientMeter.app.models.RootMeter;

    if (rootMeterId) {
      RootMeter.findById(rootMeterId, (error, instance) => {
        if (!instance) err();
        done();
      });
    } else {
      done();
    }
  }
  ClientMeter.validateAsync('rootMeterId', validateRootMeter, { message: error.NON_EXISTENT_DATA });
};
