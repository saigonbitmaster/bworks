'use strict';
const aggregate = require('../../utils/aggregate');

module.exports = Client => {
  Client.getClientGroupedByType = async () => {
    // Use aggregation to get client counts grouped by type
    const query = [{ $group: { _id: '$type', count: { $sum: 1 } } }, { $project: { name: '$_id', value: '$count' } }];
    const clientCountGroupedByType = await aggregate(Client, query);
    return clientCountGroupedByType;
  };

  Client.remoteMethod('getClientGroupedByType', {
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
