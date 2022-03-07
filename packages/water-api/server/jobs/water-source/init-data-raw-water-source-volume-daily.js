const moment = require('moment-timezone');
const typeTime = 'days';
const step = 1; // 1day
const maxRaw = 24; // 1ngay =>  24 record hour
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLoggerId, logTime) {
    let tmp = {};
    tmp.minFlowRate = funcLogs.randomIntInc(400, 500);
    tmp.maxFlowRate = funcLogs.randomIntInc(500, 600);
    tmp.avgFlowRate = (tmp.minFlowRate + tmp.maxFlowRate) / 2;

    let m = 10000000;
    tmp.minVolume = funcLogs.randomIntInc(m, m + 1000);
    tmp.maxVolume = funcLogs.randomIntInc(m + 5000, m + 6000);
    tmp.avgVolume = (tmp.minVolume + tmp.maxVolume) / 2;

    tmp.dataLoggerId = dataLoggerId;

    tmp.logTime = moment(logTime)
      .startOf('day')
      .toDate();
    tmp.rawData = funcLogs.generateRawData(logTime);
    return tmp;
  },
  // init data bi thieu
  initShortageData: async function(app, loggers, current) {
    let startDayLog = await app.models.CtmConfig.getConfigByKey('startDayLog');
    for (let i = 0; i < loggers.length; i++) {
      let itemLogger = loggers[i];
      let data = await app.models.RawWaterSourceVolumeDaily.findOne({
        where: { dataLoggerId: itemLogger.id },
        order: 'logTime DESC',
      });
      // console.log('data logger: ', data.logTime);
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
          let tmp = funcLogs.getDataRecord(itemLogger.id, time);
          // console.log(tmp);
          await app.models.RawWaterSourceVolumeDaily.create(tmp);
          time = time.add(step, typeTime);
          count++;
          if (count > 100) {
            break;
          }
          // console.log('initShortageData ', tmp, moment(time).diff(moment(end), typeTime));
        }
      }
    }
  },
  generateRawData: function(logTime) {
    let rawData = {};
    for (let i = 0; i < maxRaw; i++) {
      rawData[i] = {};

      rawData[i]['minFlowRate'] = funcLogs.randomIntInc(400, 500);
      rawData[i]['maxFlowRate'] = funcLogs.randomIntInc(500, 600);

      let m = 10000000;
      rawData[i]['minVolume'] = funcLogs.randomIntInc(m, m + 1000);
      rawData[i]['maxVolume'] = funcLogs.randomIntInc(m + 5000, m + 6000);

      rawData[i]['logTime'] = moment(logTime)
        .startOf('day')
        .add(i, 'hours')
        .toDate();
    }
    return rawData;
  },
  // eslint-disable-next-line
  jobRawWaterSourceVolume: async function({ app, options }) {
    try {
      console.log('=== START jobRawWaterSourceVolume daily ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.DataLogger.find({});

      let current = new Date();
      // console.log('current time: ', current);

      await funcLogs.initShortageData(app, loggers, current);

      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        let tmp = funcLogs.getDataRecord(itemLogger.id, current);
        let data = await app.models.RawWaterSourceVolumeDaily.findOne({
          where: {
            and: [
              { dataLoggerId: itemLogger.id },
              {
                logTime: moment(current)
                  .startOf('day')
                  .toDate(),
              },
            ],
          },
        });

        if (data) continue;

        await app.models.RawWaterSourceVolumeDaily.create(tmp);
      }

      console.log('=== END jobRawWaterSourceVolume daily ===');
    } catch (e) {
      console.log('=== ERROR jobRawWaterSourceVolume daily: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
