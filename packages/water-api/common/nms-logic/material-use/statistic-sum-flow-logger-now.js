'use strict';
const moment = require('moment-timezone');

module.exports = function(MaterialUse) {
  MaterialUse.statisticSumFlowLoggerNow = async (id, day) => {
    if (!id || !day) {
      return [];
    }
    // get logger data
    const logger = await MaterialUse.findById(id);

    if (!logger) return [];

    const start = moment(day).toDate();

    let condition = { order: 'logTime DESC', fields: { maxFlow: true, logTime: true, id: true } };
    condition.where = { and: [{ key: logger.optionKey }, { logTime: { lte: start } }] };
    let data = await MaterialUse.app.models.LogFlowLoggerHour.findOne(condition);
    if (data) {
      return { id: data.id, key: logger.optionKey, logTime: data.logTime, maxFlow: data.maxFlow };
    }
    return {};
  };
  // lay tong luu luong(m3) tai thoi diem hien tai
  MaterialUse.remoteMethod('statisticSumFlowLoggerNow', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'day', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
