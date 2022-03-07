'use strict';
const httpError = require('http-errors');

module.exports = ClientUser => {
  ClientUser.setPasswordToNewAccount = async (newPassword, requestSignature) => {
    // Get request data in Redis using `requestSignature` as key
    // If there is none in the memory store, probably it has expired. The second chance of being corrupted by Redis is extremely slim
    const requestedClientUserData = await ClientUser.app.models.ClientUserAccountRequest.get(requestSignature);
    if (!requestedClientUserData) {
      throw httpError(500, 'error.EXPIRED_REQUEST');
    }
    // Create the requested client user
    try {
      requestedClientUserData.password = newPassword;
      await ClientUser.create(requestedClientUserData);
    } catch (err) {
      // Probably ValidationError
      // eslint-disable-next-line no-console
      console.log(err);
    }
  };
  ClientUser.remoteMethod('setPasswordToNewAccount', {
    accepts: [
      { arg: 'newPassword', type: 'string', required: true },
      { arg: 'requestSignature', type: 'string', required: true },
    ],
    http: { verb: 'post' },
  });
};
