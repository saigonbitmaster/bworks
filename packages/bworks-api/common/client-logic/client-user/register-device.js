'use strict';
const createError = require('http-errors');
const { unionBy, get } = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = function(ClientUser) {
  ClientUser.registerDevice = async (device, options) => {
    if (options.accessToken) {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await ClientUser.findById(userId);
      const { userdevices = [] } = currentUser;
      const updatedUserDevices = unionBy(userdevices, [device], 'id');
      currentUser.updateAttribute('userDevices', updatedUserDevices);
    } else {
      throw createError(400, 'error.UNDEFINED_USER_TOKEN');
    }
  };

  ClientUser.remoteMethod('registerDevice', {
    accepts: [
      { arg: 'device', type: 'object', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
