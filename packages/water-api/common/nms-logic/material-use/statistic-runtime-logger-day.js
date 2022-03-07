'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = function(MaterialUse) {
  MaterialUse.statisticRuntimeLoggerDay = async (id, from, to) => {
    if (!id || !from || !to) {
      return [];
    }
    // get logger data
    const logger = await MaterialUse.findById(id);
    if (!logger) return [];
    const startDay = moment(from)
      .startOf('day')
      .toDate();
    const endDay = moment(to)
      .endOf('day')
      .toDate();
    const query = [
      {
        $match: {
          key: logger.optionKey,
          logTime: {
            $gte: startDay,
            $lte: endDay,
          },
        },
      },
      // { $limit: 10000 },
      {
        $facet: {
          average: [{ $group: { _id: null, avgTotalPressure: { $avg: '$avgPressure' } } }],
          data: [
            {
              $project: {
                logTime: { $convert: { input: '$logTime', to: 'long' } },
                flowRate: ['$minFlowRate', '$maxFlowRate'],
                pressure: ['$minPressure', '$maxPressure'],
                maxFlow: 1,
                avgPressure: 1,
              },
            },
          ],
        },
      },
      // {
      //   $project: {
      //     logTime: { $convert: { input: '$logTime', to: 'long' } },
      //     flowRate: ['$minFlowRate', '$maxFlowRate'],
      //     pressure: ['$minPressure', '$maxPressure'],
      //     avgPressure: 1,
      //     maxFlow: 1,
      //   },
      // },
    ];
    const result = await aggregate(MaterialUse.app.models.LogFlowLoggerHour, query);
    return result;
  };

  // lay luu luong(m3/h), ap luc (bar) tuc thoi
  MaterialUse.remoteMethod('statisticRuntimeLoggerDay', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'from', type: 'date', required: true },
      { arg: 'to', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
