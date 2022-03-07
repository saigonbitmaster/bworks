const moment = require('moment-timezone');
const typeTime = 'minutes';
const numMinute = 1;
const modelLog = 'NmsLogRawQuality';
const get = require('lodash/get');
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLogger, waterParameters, logTime) {
    let tmp = {};
    for (let i = 0; i < waterParameters.length; i++) {
      let param = waterParameters[i];
      switch (param) {
        case 'ph': {
          tmp.ph = funcLogs.randomIntInc(1, 7); // 1 - 7
          break;
        }
        case 'ntu': {
          tmp.ntu = funcLogs.randomIntInc(1, 4); // 1 - 4
          break;
        }
        case 'cod': {
          tmp.cod = funcLogs.randomIntInc(1, 6); // 1 - 6
          break;
        }
      }
    }

    // generate ap luc
    tmp.flowRate = funcLogs.randomIntInc(200, 350);
    tmp.volume = Math.floor(Math.random() * 10000 + 10000000);

    tmp.dataLoggerId = dataLogger.id;
    tmp.dmaId = dataLogger.dmaId;
    tmp.logTime = moment(logTime);
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
      let data = await app.models[modelLog].findOne({
        where: { and: [{ dataLoggerId: itemLogger.id }, { dmaId: itemLogger.dmaId }] },
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
        start = start.add(numMinute, typeTime);
        for (let time = start; moment(time).diff(moment(end), typeTime) < 0; ) {
          let tmp = funcLogs.getDataRecord(itemLogger, waterParameters, time);
          await app.models[modelLog].create(tmp);
          time = time.add(numMinute, typeTime);
        }
      }
    }
  },
  // eslint-disable-next-line
  jobRawQuality: async function({ app, options }) {
    try {
      console.log('=== START jobRawQuality ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.MaterialUse.find({ where: { type: 'QualityLogger' } });
      let current = new Date();
      await funcLogs.initShortageData(app, loggers, current);
      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        let waterParameters = get(itemLogger, 'waterParameter', '');
        if (!waterParameters || !waterParameters.length) {
          continue;
        }
        let tmp = funcLogs.getDataRecord(itemLogger, waterParameters, current);
        let data = await app.models[modelLog].findOne({
          where: {
            and: [
              { dataLoggerId: itemLogger.id },
              { dmaId: itemLogger.dmaId },
              {
                logTime: current,
              },
            ],
          },
        });
        if (data) continue;
        await app.models[modelLog].create(tmp);
      }
      console.log('=== END jobRawQuality===');
    } catch (e) {
      console.log('=== ERROR jobRawQuality: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
