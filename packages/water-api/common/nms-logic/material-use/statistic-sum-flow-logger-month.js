'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = function(MaterialUse) {
  // input:
  // startMonth, endMonth: 'YYYY-MM'
  MaterialUse.statisticSumFlowLoggerMonth = async (id, startMonth, endMonth) => {
    if (!id || !startMonth || !endMonth) {
      return [];
    }

    const timezone = MaterialUse.app.get('timezone');

    // get logger data
    const logger = await MaterialUse.findById(id);
    if (!logger) return [];

    const start = moment(startMonth)
      .subtract(1, 'month')
      .startOf('month')
      .toDate();
    const end = moment(endMonth)
      .endOf('month')
      .toDate();

    // console.log('statisticRuntimeLoggerMonth', start, end);

    const query = [
      {
        $match: {
          key: logger.optionKey,
          logTime: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: { date: '$logTime', timezone: timezone } },
            year: { $year: { date: '$logTime', timezone: timezone } },
          },
          maxFlow: { $max: '$maxFlow' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ];

    const data = await aggregate(MaterialUse.app.models.LogFlowLoggerDay, query);
    // console.log('data', data);

    if (!data || !data.length) {
      return [];
    }

    let length = data.length;
    let result = [];

    let firstItem = data[0];

    let t1 = `${firstItem._id.year}-${firstItem._id.month.toString().padStart(2, '0')}`;

    let t2 = moment(start).format('YYYY-MM');
    let hasTmp = t1 === t2;

    if (length === 1) {
      if (hasTmp) {
        return [];
      }
      let tmp = {};
      tmp.maxFlow = firstItem.maxFlow;
      tmp.logTime = moment(`${firstItem._id.year}-${firstItem._id.month}`, 'YYYY-MM')
        .startOf('month')
        .toDate();
      result.push(tmp);
    }
    if (length > 1) {
      let itemPrev = {};
      let next = 0;

      if (hasTmp) {
        itemPrev = firstItem;
        next = 1;
      } else {
        itemPrev = {
          maxFlow: 0,
        };
        next = 0;
      }
      for (let i = next; i < data.length; i++) {
        let itemCur = data[i];
        let tmp = {};
        tmp.maxFlow = itemCur.maxFlow - itemPrev.maxFlow;
        tmp.logTime = moment(`${itemCur._id.year}-${itemCur._id.month}`, 'YYYY-MM')
          .startOf('month')
          .toDate();
        result.push(tmp);
        itemPrev = itemCur;
      }
    }
    // console.log('result', result);
    return result;
  };
  // lay tong luu luong(m3) theo thang
  MaterialUse.remoteMethod('statisticSumFlowLoggerMonth', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'startMonth', type: 'string', required: true },
      { arg: 'endMonth', type: 'string', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
