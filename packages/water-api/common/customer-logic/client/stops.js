'use strict';
module.exports = function(Client) {
  Client.stops = async ids => {
    let result = Client.updateAll({ id: { inq: ids }, status: 'ACTIVE' }, { status: 'STOP' });
    return result;
  };
  Client.remoteMethod('stops', {
    accepts: [{ arg: 'ids', type: ['string'] }],
    returns: { root: true, type: 'any' },
  });
};
