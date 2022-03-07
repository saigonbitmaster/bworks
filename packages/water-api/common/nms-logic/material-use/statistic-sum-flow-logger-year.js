'use strict';
const moment = require('moment-timezone');
const aggregate = require('../../utils/aggregate');

module.exports = function(MaterialUse) {
  // input:
  // startMonth, endMonth: 'YYYY'
  MaterialUse.statisticSumFlowLoggerYear = async (id, startYear, endYear) => {
    if (!id || !startYear || !endYear) {
      return [];
    }

    const timezone = MaterialUse.app.get('timezone');

    // get logger data
    const logger = await MaterialUse.findById(id);
    if (!logger) return [];

    const start = moment(startYear, 'YYYY')
      .subtract(1, 'year')
      .startOf('year')
      .toDate();
    const end = moment(endYear, 'YYYY')
      .endOf('year')
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
            year: { $year: { date: '$logTime', timezone: timezone } },
          },
          maxFlow: { $max: '$maxFlow' },
        },
      },
      { $sort: { '_id.year': 1 } },
    ];
    const data = await aggregate(MaterialUse.app.models.LogFlowLoggerDay, query);
    // console.log('data', data);

    if (!data || !data.length) {
      return [];
    }

    let length = data.length;
    let result = [];

    let firstItem = data[0];
    let hasTmp = firstItem._id.year === Number(startYear) - 1;

    if (length === 1) {
      if (hasTmp) {
        return [];
      }
      let tmp = {};
      tmp.maxFlow = firstItem.maxFlow;
      tmp.logTime = moment(firstItem._id.year, 'YYYY')
        .startOf('year')
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
        tmp.logTime = moment(`${itemCur._id.year}-${itemCur._id.month}`, 'YYYY')
          .startOf('year')
          .toDate();
        result.push(tmp);
        itemPrev = itemCur;
      }
    }
    // console.log('result', result);
    return result;
  };
  // lay tong luu luong(m3) theo nam
  MaterialUse.remoteMethod('statisticSumFlowLoggerYear', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'startYear', type: 'string', required: true },
      { arg: 'endYear', type: 'string', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
