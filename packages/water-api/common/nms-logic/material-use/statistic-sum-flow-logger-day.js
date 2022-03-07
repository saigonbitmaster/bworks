'use strict';
const moment = require('moment-timezone');

module.exports = function(MaterialUse) {
  MaterialUse.statisticSumFlowLoggerDay = async (id, dayFrom, dayTo) => {
    if (!id || !dayFrom || !dayTo) {
      return [];
    }
    // get logger data
    const logger = await MaterialUse.findById(id);

    if (!logger) return [];

    const startDay = moment(dayFrom)
      .subtract(1, 'day')
      .startOf('day')
      .toDate();
    const endDay = moment(dayTo)
      .endOf('day')
      .toDate();

    // console.log(logger, startDay, endDay);

    let cdt = {};
    cdt.where = { and: [{ key: logger.optionKey }, { logTime: { gte: startDay } }, { logTime: { lte: endDay } }] };
    cdt.order = 'logTime ASC';
    let data = await MaterialUse.app.models.LogFlowLoggerDay.find(cdt);

    // console.log(data);

    if (!data || !data.length) {
      return [];
    }

    let length = data.length;
    let result = [];

    let firstItem = data[0];

    let t1 = moment(firstItem.logTime).format('YYYY-MM-DD');
    let t2 = moment(startDay).format('YYYY-MM-DD');

    let hasTmp = t1 === t2;

    if (length === 1) {
      if (hasTmp) {
        return [];
      }
      let tmp = {};
      tmp.maxFlow = firstItem.maxFlow;
      tmp.logTime = moment(firstItem.logTime)
        .startOf('day')
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
        tmp.logTime = moment(itemCur.logTime)
          .startOf('day')
          .toDate();
        result.push(tmp);
        itemPrev = itemCur;
      }
    }
    // console.log('result', result);
    return result;
  };
  // thong ke tong luu luong theo ngay
  MaterialUse.remoteMethod('statisticSumFlowLoggerDay', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'dayFrom', type: 'date', required: true },
      { arg: 'dayTo', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
