const { get } = require('lodash');
module.exports = function(ClientUser) {
  ClientUser.getClientInfo = async options => {
    const userId = get(options, 'accessToken.userId');
    const currentUser = await ClientUser.findById(userId);
    const { name, username, settings } = currentUser;
    return {
      name,
      username,
      settings,
    };
  };

  ClientUser.remoteMethod('getClientInfo', {
    accepts: [{ arg: 'options', type: 'object', http: 'optionsFromRequest' }],
    returns: { arg: 'data', type: 'boolean', root: true },
    http: { verb: 'get' },
  });
};
