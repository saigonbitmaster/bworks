const moment = require('moment-timezone');
const get = require('lodash/get');
const modelLog = 'NmsLogWaterQualityDaily';
const typeTime = 'days';
const step = 1; // 1day
const maxRaw = 24; // 1ngay =>  24 record hour
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLogger, waterParameter, logTime) {
    let tmp = {};
    tmp.minValue = funcLogs.randomIntInc(3, 5);
    tmp.maxValue = funcLogs.randomIntInc(6, 8);
    tmp.avgValue = (tmp.minValue + tmp.maxValue) / 2;
    tmp.waterParameter = waterParameter;
    tmp.dataLoggerId = dataLogger.id;
    tmp.dmaId = dataLogger.dmaId;
    tmp.logTime = moment(logTime)
      .startOf('day')
      .toDate();
    tmp.rawData = funcLogs.generateRawData(logTime);
    return tmp;
  },
  // init data bi thieu
  initShortageData: async function(app, loggers, current) {
    let startDayLog = await app.models.NmsConfig.getConfigByKey('startDayLog');
    for (let i = 0; i < loggers.length; i++) {
      let itemLogger = loggers[i];
      let waterParameters = get(itemLogger, 'waterParameter', '');
      if (!waterParameters || !waterParameters.length) {
        continue;
      }
      for (let k = 0; k < waterParameters.length; k++) {
        let waterParameter = waterParameters[k];
        let data = await app.models[modelLog].findOne({
          where: { and: [{ dataLoggerId: itemLogger.id }, { waterParameter }, { dmaId: itemLogger.dmaId }] },
          order: 'logTime DESC',
        });

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
          for (let time = start; moment(time).diff(moment(end), typeTime) < 0; ) {
            let tmp = funcLogs.getDataRecord(itemLogger, waterParameter, time);
            await app.models[modelLog].create(tmp);
            time = time.add(step, typeTime);
          }
        }
      }
    }
  },
  generateRawData: function(logTime) {
    let rawData = {};
    for (let i = 0; i < maxRaw; i++) {
      rawData[i] = {};
      rawData[i]['minValue'] = funcLogs.randomIntInc(3, 5);
      rawData[i]['maxValue'] = funcLogs.randomIntInc(6, 8);
      rawData[i]['logTime'] = moment(logTime)
        .startOf('day')
        .add(i, 'hours')
        .toDate();
    }
    return rawData;
  },
  // eslint-disable-next-line
  jobQualityDaily: async function({ app, options }) {
    try {
      console.log('=== START NmsLogWaterQualityDaily ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.MaterialUse.find({ where: { type: 'QualityLogger' } });

      let current = new Date();

      await funcLogs.initShortageData(app, loggers, current);

      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        let waterParameters = get(itemLogger, 'waterParameter', '');
        if (!waterParameters || !waterParameters.length) {
          continue;
        }
        for (let k = 0; k < waterParameters.length; k++) {
          let waterParameter = waterParameters[k];
          let tmp = funcLogs.getDataRecord(itemLogger, waterParameter, current);
          let data = await app.models[modelLog].findOne({
            where: {
              and: [
                { dataLoggerId: itemLogger.id },
                { waterParameter },
                { dmaId: itemLogger.dmaId },
                {
                  logTime: moment(current)
                    .startOf('day')
                    .toDate(),
                },
              ],
            },
          });
          if (data) continue;
          await app.models[modelLog].create(tmp);
        }
      }
      console.log('=== END NmsLogWaterQualityDaily ===');
    } catch (e) {
      console.log('=== ERROR NmsLogWaterQualityDaily: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
