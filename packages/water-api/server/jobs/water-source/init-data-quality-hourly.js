const moment = require('moment-timezone');
const typeTime = 'hours';
const step = 1; // 1h
const maxRaw = 12; // 1h => 5 phut => 1 record
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLoggerId, waterParameterId, logTime) {
    let tmp = {};
    tmp.minValue = funcLogs.randomIntInc(4, 5);
    tmp.maxValue = funcLogs.randomIntInc(6, 10);
    tmp.avgValue = (tmp.minValue + tmp.maxValue) / 2;
    tmp.waterParameterId = waterParameterId;
    tmp.dataLoggerId = dataLoggerId;
    tmp.logTime = moment(logTime)
      .startOf('hour')
      .toDate();
    tmp.rawData = funcLogs.generateRawData(logTime);
    return tmp;
  },
  // init data bi thieu
  initShortageData: async function(app, loggers, waterParameters, current) {
    let startDayLog = await app.models.CtmConfig.getConfigByKey('startDayLog');
    for (let i = 0; i < loggers.length; i++) {
      let itemLogger = loggers[i];
      for (let k = 0; k < waterParameters.length; k++) {
        let waterParameterId = waterParameters[k].id;
        // console.log('itemLogger: ', itemLogger.id);
        // if (!itemLogger.id.equals('5be79e116c225b401e1f89e1')) continue;
        let data = await app.models.WaterQualityHourly.findOne({
          where: { and: [{ dataLoggerId: itemLogger.id }, { waterParameterId }] },
          order: 'logTime DESC',
        });
        // console.log('waterParameterIdr: ', waterParameterId);

        let logTime = data
          ? data.logTime
          : moment(startDayLog.value)
              .startOf('day')
              .toDate();
        let start = moment(logTime);
        let end = moment(current);
        let diff = moment(start).diff(moment(end), typeTime);
        if (diff < 0) {
          start = start.add(step, typeTime);
          let count = 0;
          for (let time = start; moment(time).diff(moment(end), typeTime) < 0; ) {
            let tmp = funcLogs.getDataRecord(itemLogger.id, waterParameterId, time);
            // console.log('====diff', tmp);
            await app.models.WaterQualityHourly.create(tmp);
            time = time.add(step, typeTime);
            count++;
            if (count > 100) {
              break;
            }
            // console.log('initShortageData ', tmp, moment(time).diff(moment(end), typeTime));
          }
        }
      }
    }
  },
  generateRawData: function(logTime) {
    let rawData = {};
    for (let i = 0; i < maxRaw; i++) {
      rawData[i] = {};
      rawData[i]['value'] = funcLogs.randomIntInc(4, 10);
      // 5 phut 1 value
      rawData[i]['logTime'] = moment(logTime)
        .startOf('hour')
        .add(5 * i, 'minutes')
        .toDate();
    }
    return rawData;
  },
  // eslint-disable-next-line
  jobQualityHourly: async function({ app, options }) {
    try {
      // eslint-disable-next-line
      console.log('=== START jobQualityHourly ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.DataLogger.find({});
      let waterParameters = await app.models.WaterParameter.find({});
      let current = new Date();
      // console.log('current time: ', current);
      await funcLogs.initShortageData(app, loggers, waterParameters, current);
      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        for (let k = 0; k < waterParameters.length; k++) {
          let waterParameterId = waterParameters[k].id;
          let tmp = funcLogs.getDataRecord(itemLogger.id, waterParameterId, current);
          // console.log('int data current: ', moment().format('YYYY/MM/DD HH:mm:ss'), tmp);
          let data = await app.models.WaterQualityHourly.findOne({
            where: {
              and: [
                { dataLoggerId: itemLogger.id },
                { waterParameterId },
                {
                  logTime: moment(current)
                    .startOf('hour')
                    .toDate(),
                },
              ],
            },
          });
          if (data) continue;
          await app.models.WaterQualityHourly.create(tmp);
        }
      }
      console.log('=== END jobQualityHourly ===');
    } catch (e) {
      console.log('=== ERROR jobQualityHourly: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
