'use strict';
const get = require('lodash/get');
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = function(Dma) {
  const queryRootLogger = () => {
    return [
      { $match: { level: 1 } },
      { $project: { name: true, _id: true, level: true } },
      {
        $lookup: {
          from: 'MaterialUse',
          let: { dmaId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$dmaId', '$$dmaId'] }, { $eq: ['$type', 'FlowLogger'] }],
                },
              },
            },
            { $project: { name: 1, optionKey: 1 } },
          ],
          as: 'loggers',
        },
      },
      { $unwind: '$loggers' },
    ];
  };

  const querySummaryDay = (day, keys) => {
    const fixDay = moment(day)
      .startOf('day')
      .toDate();
    const previousDay = moment(fixDay)
      .subtract(1, 'days')
      .toDate();
    return [
      {
        $match: {
          key: { $in: keys },
          logTime: {
            $in: [fixDay, previousDay],
          },
        },
      },
      { $project: { maxFlow: 1, logTime: 1, key: 1 } },
      { $sort: { logTime: 1 } },
      { $group: { _id: '$key', all: { $push: '$$ROOT' } } },
      { $project: { current: { $arrayElemAt: ['$all', 1] }, previous: { $arrayElemAt: ['$all', 0] } } },
      { $project: { delta: { $subtract: ['$current.maxFlow', '$previous.maxFlow'] } } },
      {
        $group: {
          _id: null,
          data: { $sum: '$delta' },
        },
      },
      { $limit: 1 },
    ];
  };

  const querySummaryMonth = (month, keys) => {
    let fixMonth = moment.min(moment(month), moment());
    fixMonth = fixMonth.startOf('day').toDate();
    let previousMonth = moment(fixMonth) // last day of previous month
      .subtract(1, 'months')
      .endOf('month')
      .startOf('day')
      .toDate();

    return [
      {
        $match: {
          key: { $in: keys },
          logTime: {
            $in: [fixMonth, previousMonth],
          },
        },
      },
      { $project: { maxFlow: 1, logTime: 1, key: 1 } },
      { $sort: { logTime: 1 } },
      { $group: { _id: '$key', all: { $push: '$$ROOT' } } },
      { $project: { current: { $arrayElemAt: ['$all', 1] }, previous: { $arrayElemAt: ['$all', 0] } } },
      { $project: { delta: { $subtract: ['$current.maxFlow', '$previous.maxFlow'] } } },
      {
        $group: {
          _id: null,
          data: { $sum: '$delta' },
        },
      },
      { $limit: 1 },
    ];
  };

  Dma.summaryQuantity = async (current = moment().toDate()) => {
    const LogFlowLoggerDay = Dma.app.models.LogFlowLoggerDay;
    let loggerData = await aggregate(Dma, queryRootLogger());
    loggerData = loggerData.filter(item => get(item, 'loggers.tags') !== 'middle');
    let optionKeys = loggerData.map(item => get(item, 'loggers.optionKey'));
    optionKeys = optionKeys.filter(item => !!item);

    let query = querySummaryDay(current, optionKeys);
    const today = await aggregate(LogFlowLoggerDay, query);

    query = querySummaryDay(moment(current).subtract(1, 'day'), optionKeys);
    const yesterday = await aggregate(LogFlowLoggerDay, query);

    query = querySummaryMonth(current, optionKeys);
    const thisMonth = await aggregate(LogFlowLoggerDay, query);

    query = querySummaryMonth(moment(current).subtract(1, 'month'), optionKeys);
    const lastMonth = await aggregate(LogFlowLoggerDay, query);

    const result = {
      today: today && today.length ? today[0].data : null,
      yesterday: yesterday && yesterday.length ? yesterday[0].data : null,
      thisMonth: thisMonth && thisMonth.length ? thisMonth[0].data : null,
      lastMonth: lastMonth && lastMonth.length ? lastMonth[0].data : null,
    };
    return result;
  };
  Dma.remoteMethod('summaryQuantity', {
    accepts: [{ arg: 'current', type: 'date' }],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
