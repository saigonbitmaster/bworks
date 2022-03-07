'use strict';
const aggregate = require('../../utils/aggregate');

module.exports = function(MaterialUse) {
  MaterialUse.summaryDataLogger = async () => {
    const query = [
      {
        $match: {
          type: 'FlowLogger',
        },
      },
      { $group: { _id: '$health', total: { $sum: 1 } } },
      {
        $group: {
          _id: null,
          warn: {
            $sum: { $cond: [{ $eq: ['$_id', 'WARN'] }, '$total', 0] },
          },
          bad: {
            $sum: { $cond: [{ $eq: ['$_id', 'BAD'] }, '$total', 0] },
          },
          total: {
            $sum: '$total',
          },
        },
      },
      { $limit: 1 },
      { $project: { _id: 0 } },
    ];
    const data = await aggregate(MaterialUse, query);
    if (data && data.length) return data[0]; // { warn: 1, bad: 2, total: 3 }
    return {};
  };
  MaterialUse.remoteMethod('summaryDataLogger', {
    accepts: [],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
