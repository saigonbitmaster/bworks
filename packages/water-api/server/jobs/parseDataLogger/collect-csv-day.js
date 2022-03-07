'use strict';
const util = require('util');
const moment = require('moment-timezone');
const mapSeries = util.promisify(require('async/mapSeries'));
const { minPositive, maxPositive, sumPositive } = require('../../../common/utils/number');
module.exports = async ({ app }) => {
  try {
    // get hour data
    let jobTime = moment();
    let loggerHours = await app.models.LogFlowLoggerHour.find({
      where: { step: 'init' },
      limit: 1000,
      order: ['key ASC', 'logTime ASC'],
    });
    let logs = {};
    await mapSeries(loggerHours || [], async logHour => {
      let time = moment(logHour.minLogTime || logHour.logTime);
      let itemIndex = time.hours();
      let id = `${logHour.key}-${moment(logHour.logTime).format('YYMMDD')}`;
      let log = logs[id];
      if (!log) {
        // find from db
        log = await app.models.LogFlowLoggerDay.findById(id);
        if (!log) {
          log = {
            id,
            key: logHour.key,
            minFlowRate: 0,
            avgFlowRate: 0,
            maxFlowRate: 0,
            minPressure: 0,
            avgPressure: 0,
            maxPressure: 0,
            maxFlow: 0,
            preFlow: 0,
            consumption: 0,
            preLogTime: null,
            minLogTime: logHour.minLogTime,
            maxLogTime: logHour.maxLogTime,
            minBattery: 0,
            rawData: {},
            logTime: time.startOf('day').toDate(),
            createdDate: moment().toDate(),
          };
        }
        logs[id] = log;
      }
      const {
        minFlowRate = 0,
        avgFlowRate = 0,
        maxFlowRate = 0,
        minPressure = 0,
        avgPressure = 0,
        maxPressure = 0,
        maxFlow = 0,
        minBattery = 0,
        minLogTime,
        maxLogTime,
      } = logHour.__data;

      logs[id].rawData[itemIndex] = {
        minFlowRate,
        avgFlowRate,
        maxFlowRate,
        minPressure,
        avgPressure,
        maxPressure,
        maxFlow,
        minBattery,
        minLogTime,
        maxLogTime,
      };
    });
    // recalculate variables
    let logIds = Object.keys(logs);
    await mapSeries(logIds, async id => {
      let log = logs[id];
      let minFlowRate = 0;
      let totalFlowRate = 0;
      let maxFlowRate = 0;
      let minPressure = 0;
      let totalPressure = 0;
      let maxPressure = 0;
      let maxFlow = 0;
      let minBattery = 0;
      let itemKeys = Object.keys(log.rawData);
      let minLogTime;
      let maxLogTime;
      itemKeys.map(itemKey => {
        let item = log.rawData[itemKey];
        // flowRate
        minFlowRate = minPositive(item.minFlowRate, minFlowRate);
        totalFlowRate = sumPositive(totalFlowRate, item.avgFlowRate);
        maxFlowRate = maxPositive(maxFlowRate, item.maxFlowRate);
        // pressure
        minPressure = minPositive(item.minPressure, minPressure);
        totalPressure = sumPositive(totalPressure, item.avgPressure);
        maxPressure = maxPositive(maxPressure, item.maxPressure);
        // flow
        maxFlow = maxPositive(item.maxFlow, maxFlow) || 0;
        // battery
        minBattery = minPositive(item.minBattery, minBattery);
        minLogTime = moment.min(moment(item.minLogTime || log.logTime), moment(log.minLogTime || log.logTime)).toDate();
        maxLogTime = moment.max(moment(item.maxLogTime || log.logTime), moment(log.maxLogTime || log.logTime)).toDate();
      });

      // previous day
      const previousDay = await app.models.LogFlowLoggerDay.findOne({
        where: { key: log.key, logTime: { lt: log.logTime } },
        order: 'logTime DESC',
      });
      const preFlow = previousDay ? previousDay.maxFlow : 0;
      const preLogTime = previousDay ? previousDay.maxLogTime || previousDay.minLogTime || previousDay.logTime : null;

      log = {
        ...(log.__data || log),
        minFlowRate,
        avgFlowRate: totalFlowRate / itemKeys.length,
        maxFlowRate,
        minPressure,
        avgPressure: totalPressure / itemKeys.length,
        maxPressure,
        maxFlow,
        minBattery,
        preFlow,
        consumption: maxFlow - preFlow,
        preLogTime: preLogTime,
        minLogTime,
        maxLogTime,
        updatedDate: moment().toDate(),
        step: 'init',
      };
      // insert or update to db
      await app.models.LogFlowLoggerDay.upsertWithWhere({ id }, log);
    });
    // update step for hour
    let ids = loggerHours.map(logHour => logHour.id);
    let result = await app.models.LogFlowLoggerHour.updateAll(
      { id: { in: ids }, updatedDate: { lt: jobTime.toDate() } },
      {
        step: 'day',
      },
    );
    return { ids, hourCount: result && result.count ? result.count : 0 };
  } catch (error) {
    //
  }
};
