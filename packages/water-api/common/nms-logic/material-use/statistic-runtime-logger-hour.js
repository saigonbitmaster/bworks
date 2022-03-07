'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = function(MaterialUse) {
  // NOTE:
  // co su dung chung cho:
  //  + menu: bao cao luu luong/ap luc theo gio(chart)
  //  + dasboard: luu luong(m3/h), ap luc (bar) tuc thoi
  MaterialUse.statisticRuntimeLoggerHour = async (id, day, isTimeStamp) => {
    if (!id || !day) {
      return [];
    }
    // get logger data
    const logger = await MaterialUse.findById(id);
    if (!logger) return [];
    const startDay = moment(day)
      .startOf('day')
      .toDate();
    const endDay = moment(day)
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
      { $limit: 100 },
      { $sort: { logTime: 1 } },
      {
        $project: {
          hourTime: '$logTime',
          data: {
            $objectToArray: '$rawData',
          },
        },
      },
      { $unwind: '$data' },
      { $addFields: { minute: { $toInt: '$data.k' } } },
      {
        $project: {
          flowRate: '$data.v.flowRate',
          pressure: '$data.v.pressure',
          logTime: isTimeStamp
            ? { $convert: { input: { $add: ['$hourTime', { $multiply: ['$minute', 60000] }] }, to: 'long' } }
            : { $add: ['$hourTime', { $multiply: ['$minute', 60000] }] },
        },
      },
    ];
    const result = await aggregate(MaterialUse.app.models.LogFlowLoggerHour, query);
    return result;
  };

  // dasboard: lay luu luong(m3/h), ap luc (bar) tuc thoi
  MaterialUse.remoteMethod('statisticRuntimeLoggerHour', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'day', type: 'date', required: true },
      { arg: 'isTimeStamp', type: 'boolean' },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
