'use strict';
const path = require('path');
const fs = require('fs');
const util = require('util');
const { concat } = require('lodash');
const moment = require('moment-timezone');
const mapSeries = util.promisify(require('async/mapSeries'));
const csvToDb = require('../../server/jobs/csv/ems-gti5');
const { flowIncreaseFactor, flowRateFactor, pressureFactor } = require('./define.js');
const { gti5 } = require('./ems');

const defaultPath = path.join(__dirname, '../../csvs/input-files');
// eslint-disable-next-line no-console
console.log('csvs input-files', defaultPath);
const DEFAULT_LAST_LOG_TIME = process.env.NODE_EMS_LOGGER_GENERATOR_TIME
  ? moment(process.env.NODE_EMS_LOGGER_GENERATOR_TIME)
  : moment()
      .subtract(12, 'months')
      .startOf('year');
// eslint-disable-next-line no-unused-vars
const generateByDma = async (app, dma, maxTime, loggerType = { carrier: 'ems', model: 'gti5' }) => {
  // get flowLogger for dma
  let results = [];
  let loggers = await app.models.MaterialUse.find({ where: { type: 'FlowLogger', dmaId: dma.id } });
  let mainLoggers = loggers.filter(item => !item.meta || item.meta.isMiddle !== true);
  let subLoggers = loggers.filter(item => item.meta || item.meta.isMiddle === true);
  // generate csv for logger
  let demandDay = dma.avgDemandDay;
  let flowRateRange = { value: demandDay / mainLoggers.length / 24 };
  flowRateRange.variance = flowRateRange.value / 5;
  const genData = async logger => {
    let lastData = {
      flowRate: 0,
      flow: 0,
      pressure: 0,
      battery: 0,
    };
    let lastLogId = null;
    // check lastlog
    let lastLog = await app.models.LogFlowLoggerHour.findOne({
      where: { key: logger.optionKey },
      order: ['logTime DESC'],
    });
    let lastLogTime = null;
    if (lastLog && lastLog.rawData) {
      lastLogTime = moment(lastLog.maxLogTime);
      lastData = lastLog.rawData[lastLogTime.minutes().toString()];
      lastLogId = lastLog.id;
    }
    if (!lastLogTime) {
      lastLogTime = moment(DEFAULT_LAST_LOG_TIME);
    }

    if (moment(maxTime).diff(lastLogTime, 'minute') < 60) return;
    let nextLogTime = moment(lastLogTime).add(1, 'minute');
    let scaleHour = nextLogTime.hours();
    //generate
    return gti5({
      lastLogId,
      optionKey: logger.optionKey,
      model: app.models.LogFlowLoggerHour,
      flowRateRange: {
        value: (flowRateRange.value * flowRateFactor[scaleHour]) / 100,
        variance: (flowRateRange.variance * flowRateFactor[scaleHour]) / 100,
      },
      flowIncreseRange: {
        value: (flowRateRange.value * flowIncreaseFactor[scaleHour]) / 100,
        variance: (flowRateRange.variance * flowIncreaseFactor[scaleHour]) / 100,
      },
      pressureRange: {
        value: (dma.designPressure * pressureFactor[scaleHour]) / 100,
        variance: (dma.designPressure * 0.2 * pressureFactor[scaleHour]) / 100,
      },
      startLogTime: nextLogTime,
      batteryRange: { value: 3.5, variance: 0.1 },
      lastData,
    });
  };
  let main = await mapSeries(mainLoggers, async logger => genData(logger));
  main = main.filter(item => !!item);
  results = results.concat(main);
  let sub = await mapSeries(subLoggers, async logger => genData(logger));
  sub = sub.filter(item => !!item);
  results = results.concat(sub);
  return results;
};
const generate = async ({ app, options: { maxTime = moment().startOf('minutes') } }) => {
  // check csv, if exist, not run
  console.log('CSV path: ', defaultPath); // eslint-disable-line
  let results;
  try {
    let files = fs.readdirSync(defaultPath);
    if (files.some(f => f.toLowerCase().indexOf('.csv') >= 0)) {
      // eslint-disable-next-line no-console
      console.log('not generate csv, exist csv file');
      await csvToDb({ app });
      return { count: 0 };
    }
    // get all dma
    let dmas = await app.models.Dma.find({});
    let loop = 0;
    let maxLoop = 100;

    do {
      let minTime = moment()
        .subtract(70, 'minutes')
        .startOf('hours');
      results = await mapSeries(dmas, async dma => {
        return generateByDma(app, dma, maxTime);
      });
      results = results.filter(item => item && item.length > 0);
      results = concat(...results);
      results = results.map(item => {
        if (item && item.time && item.fileName) {
          minTime = moment.min(minTime, item.time);
          return item.fileName;
        }
        return null;
      });
      results = results.filter(item => !!item);
      console.log('Test generate All DMA OK! ', loop, minTime.format(), results.length); // eslint-disable-line no-console
      loop = minTime && moment().diff(minTime, 'day') > 2 ? loop + 1 : maxLoop;
      //process csv (special case for increase speed generator)
      await csvToDb({ app });
    } while (loop < maxLoop);

    return { files: results };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    throw err;
  }
};

module.exports = { generate };
