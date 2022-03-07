'use strict';
const get = require('lodash/get');
const utilCommon = require('water-api/common/utils/common');

module.exports = TicketSupport => {
  TicketSupport.getSecuredTicketSupport = async (filter, res, options) => {
    let dataCollect = [];
    const order = get(filter, 'order', ['createdDate DESC']);
    const limit = get(filter, 'limit', 25);
    const skip = get(filter, 'skip', 0);
    const token = options && options.accessToken;

    const userId = token && token.userId;
    if (!userId) {
      res.header('content-range', 0);
      return dataCollect;
    }

    let clientUser = await TicketSupport.app.models.ClientUser.findById(userId);
    if (!clientUser || !clientUser.clientId) {
      res.header('content-range', 0);
      return dataCollect;
    }

    dataCollect = await TicketSupport.find({ where: { clientUserId: clientUser.id }, order, skip, limit });
    return utilCommon.filterData({ order, limit, skip }, dataCollect, res);
  };

  TicketSupport.remoteMethod('getSecuredTicketSupport', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
