'use strict';
const aggregate = require('../../utils/aggregate');
// eslint-disable-next-line no-unused-vars
module.exports = function(Logflowloggerhour) {
  Logflowloggerhour.latestStatus = keys => {
    if (!keys || !keys.length) return [];
    let query = [
      { $match: { key: { $in: keys } } },
      { $group: { _id: '$key', logTime: { $max: '$logTime' } } },
      {
        $lookup: {
          from: 'LogFlowLoggerHour',
          let: { key: '$_id', logTime: '$logTime' },
          pipeline: [
            { $match: { $expr: { $and: [{ $eq: ['$key', '$$key'] }, { $eq: ['$logTime', '$$logTime'] }] } } },
            { $limit: 1 },
            { $project: { _id: false, avgFlowRate: true, avgPressure: true } },
          ],
          as: 'data',
        },
      },
      { $replaceRoot: { newRoot: { key: '$_id', logTime: '$logTime', data: { $arrayElemAt: ['$data', 0] } } } },
      {
        $replaceRoot: {
          newRoot: { key: '$key', logTime: '$logTime', pressure: '$data.avgPressure', flowRate: '$data.avgFlowRate' },
        },
      },
    ];
    return aggregate(Logflowloggerhour, query);
  };
};
