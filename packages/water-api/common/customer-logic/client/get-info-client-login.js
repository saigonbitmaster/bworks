'use strict';
module.exports = function(Client) {
  Client.getInfoClientLogin = async function(options) {
    // console.log('getInfoClientLogin');
    try {
      const token = options && options.accessToken;
      const userId = token && token.userId;
      if (!userId) {
        return {};
      }
      let clientUser = await Client.app.models.ClientUser.findById(userId);
      if (!clientUser || !clientUser.clientId) {
        return {};
      }
      let customer = await Client.findById(clientUser.clientId);
      if (!customer) {
        return {};
      }
      return customer;
    } catch (error) {
      throw error;
    }
  };
  // site: ctm-client => get thong tin khach hang login
  Client.remoteMethod('getInfoClientLogin', {
    accepts: [{ arg: 'options', type: 'object', http: 'optionsFromRequest' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
