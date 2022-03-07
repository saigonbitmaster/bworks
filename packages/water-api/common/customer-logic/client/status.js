'use strict';
module.exports = function(Client) {
  Client.status = async () => {
    let total = await Client.count({});
    let inuse = await Client.count({ status: 'ACTIVE' });
    let register = await Client.app.models.ClientRegister.count({ status: 'NEW' });
    return { total, inuse, register };
  };
  Client.remoteMethod('status', {
    accepts: [],
    http: { verb: 'get' },
    returns: { root: true, type: Array },
  });
};
