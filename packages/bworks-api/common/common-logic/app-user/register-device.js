'use strict';
const createError = require('http-errors');
const { unionBy } = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = function(AppUser) {
  AppUser.registerDevice = async (device, options) => {
    if (options.accessToken) {
      const user = await options.accessToken.user.get();
      const { userdevices = [] } = user;
      const updatedUserDevices = unionBy(userdevices, [device], 'id');
      user.updateAttribute('userDevices', updatedUserDevices);
    } else {
      throw createError(400, 'error.UNDEFINED_USER_TOKEN');
    }
  };

  AppUser.remoteMethod('registerDevice', {
    accepts: [
      { arg: 'device', type: 'object', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
