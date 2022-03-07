'use strict';
const aggregate = require('../../utils/aggregate');
const moment = require('moment-timezone');
const {
  customerReport: { waterUsageInterval, waterUsageIntervalAmount },
} = require('../../../server/config.json');

module.exports = Client => {
  Client.getClientGroupedByWaterUsage = async month => {
    // Count clients and group them by their water usage
    const intervals = [...new Array(waterUsageIntervalAmount)].map((_, index) => waterUsageInterval * index);
    const current = (month ? moment(month) : moment()).startOf('month').toDate();
    const query = [
      { $match: { $expr: { $and: [{ $lte: ['$fromDate', current] }, { $gt: ['$toDate', current] }] } } },
      {
        $project: {
          waterUsed: { $subtract: ['$currentNumber', '$previousNumber'] },
        },
      },
      {
        $bucket: {
          groupBy: '$waterUsed',
          boundaries: intervals,
          default: intervals[intervals.length - 1],
          output: {
            count: { $sum: 1 },
          },
        },
      },
      {
        $project: {
          _id: 0,
          waterUsed: '$_id',
          count: '$count',
        },
      },
      { $sort: { waterUsed: -1 } },
    ];
    const result = await aggregate(Client.app.models.ClientMeterNumber, query);
    return { result, interval: waterUsageInterval, lastBoundary: intervals[intervals.length - 1] };
  };

  Client.remoteMethod('getClientGroupedByWaterUsage', {
    accepts: { arg: 'month', type: 'date' },
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
