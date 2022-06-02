'use strict';
const createError = require('http-errors');
const { get } = require('lodash');
// eslint-disable-next-line no-unused-vars
module.exports = function(ClientUser) {
  ClientUser.changeClientSettings = async (settings, options) => {
    if (options.accessToken) {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await ClientUser.findById(userId);
      const { settings: currentSettings = {} } = currentUser;
      currentUser.updateAttribute('settings', { ...currentSettings, ...settings });
    } else {
      throw createError(400, 'error.UNDEFINED_USER_TOKEN');
    }
  };

  ClientUser.remoteMethod('changeClientSettings', {
    accepts: [
      { arg: 'settings', type: 'object', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
