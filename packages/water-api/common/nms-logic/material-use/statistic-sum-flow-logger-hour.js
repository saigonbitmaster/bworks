'use strict';
const moment = require('moment-timezone');

module.exports = function(MaterialUse) {
  MaterialUse.statisticSumFlowLoggerHour = async (id, day) => {
    if (!id || !day) {
      return [];
    }
    // const timezone = MaterialUse.app.get('timezone');
    // get logger data
    const logger = await MaterialUse.findById(id);

    if (!logger) return [];

    const start = moment(day)
      .subtract(1, 'day')
      .endOf('day')
      .startOf('hour')
      .toDate();
    const end = moment(day)
      .endOf('day')
      .toDate();

    // console.log(logger, start, end);

    let cdt = {};
    cdt.where = { and: [{ key: logger.optionKey }, { logTime: { gte: start } }, { logTime: { lte: end } }] };
    cdt.order = 'logTime ASC';
    let data = await MaterialUse.app.models.LogFlowLoggerHour.find(cdt);

    // console.log(data);

    if (!data || !data.length) {
      return [];
    }

    let length = data.length;
    let result = [];

    let firstItem = data[0];

    let t1 = moment(firstItem.logTime).format('HH');
    let t2 = moment(start).format('HH');

    let hasTmp = t1 === t2;

    if (length === 1) {
      if (hasTmp) {
        return [];
      }
      let tmp = {};
      tmp.maxFlow = firstItem.maxFlow;
      tmp.logTime = firstItem.logTime;
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
        tmp.logTime = itemCur.logTime;
        result.push(tmp);
        itemPrev = itemCur;
      }
    }
    // console.log('result', result);
    return result;
  };
  // lay tong luu luong(m3) theo gio
  MaterialUse.remoteMethod('statisticSumFlowLoggerHour', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'day', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
