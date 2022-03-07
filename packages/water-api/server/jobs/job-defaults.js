'use strict';
// const moment = require('moment-timezone');

const { generate } = require('../../testData/generates/dma');
const matStatistic = require('./statistic/mat-statistic');
const emsGti5 = require('./csv/ems-gti5');
const logFlowLoggerDay = require('./flowLogger/log-flow-logger-day');
const statisticDmaMonth = require('./statistic/statistic-dma-month');
const rawWaterSourceVolumeHourly = require('./water-source/init-data-raw-water-source-volume-hourly');
const rawWaterSourceVolumeDaily = require('./water-source/init-data-raw-water-source-volume-daily');
const waterQualityHourly = require('./water-source/init-data-quality-hourly');
const waterQualityDaily = require('./water-source/init-data-quality-daily');
const logStatisticVolumeMonth = require('./water-source/init-data-log-statistic-volume-month');
const testAppNotifications = require('./notification/testAppNotifications');
const parseDataLogger = require('./parseDataLogger');

// const dmaWaterQualityHourly = require('./dmaQualityWater/init-data-quality-hourly');
// const dmaWaterQualityDaily = require('./dmaQualityWater/init-data-quality-daily');

const nmsQualityHourly = require('./nmsQualityWater/nms-quality-hourly');
const nmsQualityDaily = require('./nmsQualityWater/nms-quality-daily');
const nmsRawQuality = require('./nmsQualityWater/nms-raw-quality');

// const waterSourceNotifications = require('./notification/waterSourceNotifications');
// const EInvoice = require('./eInvoice/eInvoice');

// eslint-disable-next-line no-unused-vars
module.exports = app => {
  let systemJobs = {};
  //Test water source email and sms notification
  //systemJobs.abc = { time: '00 00 * * * *', execute: waterSourceNotifications.emailAndSms, options: {} };
  //Test create eInvoice
  //systemJobs.eInvoice = { time: '*/60 * * * * *', execute: EInvoice.createEInvoice, options: {} };
  //Test create eInvoice
  // systemJobs.abc = {
  //   time: '*/4 * * * * *',
  //   execute: async ({ app }) => {
  //     app.runBackround({
  //       path: 'ClientMeterNumber.bgCalculateInvoices',
  //       jobKey: 'bgCalculateInvoices',
  //       data: { a: 1, b: 2 },
  //     });
  //   },
  //   options: {},
  // };
  // ems data logger
  // generate({ app, options: {} });

  if (process.env.NODE_PUSH_NOTIFICATIONS) {
    systemJobs.testAppNotifications = { time: '*/10 * * * * *', execute: testAppNotifications, options: {} };
  }

  // if (process.env.NODE_EMS_LOGGER) {
  //  if (!process.env.NODE_EMS_LOGGER_GENERATOR) {
  //    systemJobs.collectEmsLogger = { time: '*/10 * * * * *', execute: emsGti5, options: {} };
  //  }
  //  systemJobs.collectFlowLoggerDay = { time: '*/15 * * * * *', execute: logFlowLoggerDay, options: {} };
  //  systemJobs.statisticDmaMonth = { time: '* 15 * * * *', execute: statisticDmaMonth, options: {} };
  //} 
  
  if (true) {
    console.log("run ems parsing")
    if (true) {
      console.log("run ems parsing raw")
      systemJobs.collectEmsLogger = { time: '*/10 * * * * *', execute: emsGti5, options: {} };
    }
    systemJobs.collectFlowLoggerDay = { time: '*/15 * * * * *', execute: logFlowLoggerDay, options: {} };
    systemJobs.statisticDmaMonth = { time: '* 15 * * * *', execute: statisticDmaMonth, options: {} };
  }
  if (process.env.NODE_EMS_LOGGER_GENERATOR) {
    systemJobs.emsLoggerGenerator = { time: '*/5 * * * * *', execute: generate, options: {} };
  }

  // parse data for datalogger
  if (process.env.NODE_PARSE_DATALOGGER) {
    // test: 1phut / 1lan: */1 * * * *
    systemJobs.parseDataLoggerHour = {
      time: '*/1 * * * * *',
      execute: parseDataLogger.runHour,
      options: {},
    };

    // At 00:00 on every day-of-month
    systemJobs.parseDataLoggerDay = {
      time: '0 0 */1 * *',
      execute: parseDataLogger.runDay,
      options: {},
    };
  }
  if (process.env.NODE_INIT_LOG_WATER_SOURCE) {
    // note:
    // khi test: co the generate toan bo data trong 1 phut(setting lai time:  0 */1 * * * *)
    // khi deloy: setting time nhu rule

    // 0 */1 * * * * => 1 phut/1 lan
    // */1 * * * * * => 1s/1lan
    // At minute 10 past every hour : 10 */1 * * *
    // At 00:10 on every day-of-month: 10 0 */1 * *
    // At 00:10 in every month: 10 0 * */1 *

    // 1phut / 1lan
    systemJobs.jobRawWaterSourceVolumeHourly = {
      time: '0 */1 * * * *',
      execute: rawWaterSourceVolumeHourly.jobRawWaterSourceVolume,
      options: {},
    };

    // 1ngay / 1lan
    systemJobs.jobRawWaterSourceVolumeDaily = {
      time: '0 */1 * * * *',
      execute: rawWaterSourceVolumeDaily.jobRawWaterSourceVolume,
      options: {},
    };

    // 1thang / 1lan
    // At 00:10 in every month: 10 0 * */1 *
    systemJobs.jobLogStatisticVolumeMonth = {
      time: '0 */1 * * * *',
      execute: logStatisticVolumeMonth.jobLogStatisticVolumeMonth,
      options: {},
    };

    // 1h / 1lan
    // At minute 10 past every hour : 10 */1 * * *
    systemJobs.jobQualityHourly = { time: '0 */1 * * * *', execute: waterQualityHourly.jobQualityHourly, options: {} };

    // 1ngay / 1lan
    // At 00:10 on every day-of-month: 10 0 */1 * *
    systemJobs.jobQualityDaily = { time: '0 */1 * * * *', execute: waterQualityDaily.jobQualityDaily, options: {} };
  }

  // generate data for quality nms
  if (process.env.NODE_INIT_DATA_QUALITY_NMS) {
    // note:
    // khi test: co the generate toan bo data trong 1 phut(setting lai time:  0 */1 * * * *)
    // khi deloy: setting time nhu rule
    // 0 */1 * * * * => 1 phut/1 lan
    // */1 * * * * * => 1s/1lan

    //================
    // 1h / 1lan
    // At minute 10 past every hour : 10 */1 * * *
    systemJobs.jobNmsQualityHourly = {
      time: '0 */1 * * * *',
      execute: nmsQualityHourly.jobQualityHourly,
      options: {},
    };

    //===============
    // 1ngay / 1lan
    // At 00:10 on every day-of-month: 10 0 */1 * *
    systemJobs.jobNmsQualityDaily = {
      time: '0 */1 * * * *',
      execute: nmsQualityDaily.jobQualityDaily,
      options: {},
    };

    //=============
    // 1phut / 1lan
    systemJobs.jobNmsRawQuality = {
      time: '0 */1 * * * *',
      execute: nmsRawQuality.jobRawQuality,
      options: {},
    };
  }

  if (process.env.NODE_LOG_STATISTIC_MAT) {
    // */1 * * * * * => 1s
    // 0 0 0 1 * * => 1 month
    // 0 0 0 1 1 * => 1 year

    // month
    // thong ke vat tu trong kho
    systemJobs.runStatisticMatStk = {
      time: '0 0 0 1 * *',
      execute: matStatistic.mainLogStatisticMatStk,
      options: { byMonth: true },
    };
    //thong ke vat tu theo dma
    systemJobs.runStatisticMatDma = {
      time: '0 0 0 1 * *',
      execute: matStatistic.mainLogStatisticMatByDma,
      options: { byMonth: true },
    };
    //thong ke tuoi tho vat tu
    systemJobs.runStatisticMatByLifeSpan = {
      time: '0 0 0 1 * *',
      execute: matStatistic.mainLogStatisticMatByLifeSpan,
      options: { byMonth: true },
    };

    // year
    // thong ke vat tu trong kho
    systemJobs.runStatisticMatStk = {
      time: '0 0 0 1 1 *',
      execute: matStatistic.mainLogStatisticMatStk,
      options: { byMonth: false },
    };
    //thong ke vat tu theo dma
    systemJobs.runStatisticMatDma = {
      time: '0 0 0 1 1 *',
      execute: matStatistic.mainLogStatisticMatByDma,
      options: { byMonth: false },
    };
    //thong ke tuoi tho vat tu
    systemJobs.runStatisticMatByLifeSpan = {
      time: '0 0 0 1 1 *',
      execute: matStatistic.mainLogStatisticMatByLifeSpan,
      options: { byMonth: false },
    };
  }

  if (process.env.NODE_INIT_DATA_DMA_QUALITY) {
    switch (process.env.NODE_INIT_DATA_DMA_QUALITY) {
      case 'daily': {
        // Starts at 00:00 1/10/2019
        // Stops at 24:00 30/10/2019
        // const currentDaily = moment('01/10/2019', 'DD/MM/YYYY').startOf('month');
        // await dmaWaterQualityDaily.jobQualityDaily({ app, options: { current: currentDaily } });
        break;
      }
      case 'hourly': {
        // Starts at the day before `current`
        // Stops at the day after `current`
        // const currentHourly = moment();
        // await dmaWaterQualityHourly.jobQualityHourly({ app, options: { current: currentHourly } });
        break;
      }
    }
  }
  if (process.env.NODE_INIT_DATA_WATER_SOURCE) {
    console.log('NODE_INIT_DATA_WATER_SOURCE');
  }
  return systemJobs;
};
