const moment = require('moment-timezone');
const typeTime = 'days';
const step = 1; // 1day
const maxRaw = 24; // 1ngay =>  24 record hour
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLoggerId, waterParameterId, logTime) {
    let tmp = {};
    tmp.minValue = funcLogs.randomIntInc(3, 5);
    tmp.maxValue = funcLogs.randomIntInc(6, 8);
    tmp.avgValue = (tmp.minValue + tmp.maxValue) / 2;
    tmp.waterParameterId = waterParameterId;
    tmp.dataLoggerId = dataLoggerId;
    tmp.logTime = moment(logTime)
      .startOf('day')
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
        let data = await app.models.WaterQualityDaily.findOne({
          where: { and: [{ dataLoggerId: itemLogger.id }, { waterParameterId }] },
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
          let count = 0;
          for (let time = start; moment(time).diff(moment(end), typeTime) < 0; ) {
            let tmp = funcLogs.getDataRecord(itemLogger.id, waterParameterId, time);
            await app.models.WaterQualityDaily.create(tmp);
            time = time.add(step, typeTime);
            count++;
            if (count > 100) {
              break;
            }
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
      console.log('=== START jobQualityDaily ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.DataLogger.find({});

      let waterParameters = await app.models.WaterParameter.find({});

      let current = new Date();

      await funcLogs.initShortageData(app, loggers, waterParameters, current);

      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        for (let k = 0; k < waterParameters.length; k++) {
          let waterParameterId = waterParameters[k].id;
          let tmp = funcLogs.getDataRecord(itemLogger.id, waterParameterId, current);
          let data = await app.models.WaterQualityDaily.findOne({
            where: {
              and: [
                { dataLoggerId: itemLogger.id },
                { waterParameterId },
                {
                  logTime: moment(current)
                    .startOf('day')
                    .toDate(),
                },
              ],
            },
          });
          if (data) continue;
          await app.models.WaterQualityDaily.create(tmp);
        }
      }
      console.log('=== END jobQualityDaily ===');
    } catch (e) {
      console.log('=== ERROR jobQualityDaily: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
