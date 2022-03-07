const moment = require('moment-timezone');
const typeTime = 'months';
const step = 1; // 1month
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLoggerId, logTime) {
    let tmp = {};
    tmp.minFlowRate = funcLogs.randomIntInc(100, 200);
    tmp.maxFlowRate = funcLogs.randomIntInc(500, 600);
    tmp.avgFlowRate = (tmp.minFlowRate + tmp.maxFlowRate) / 2;

    let m = 10000000;
    tmp.minVolume = funcLogs.randomIntInc(m, m + 10000);
    tmp.maxVolume = funcLogs.randomIntInc(m + 50000, m + 60000);
    tmp.avgVolume = (tmp.minVolume + tmp.maxVolume) / 2;
    tmp.volume = funcLogs.randomIntInc(m + 30000, m + 90000);
    tmp.dataLoggerId = dataLoggerId;

    tmp.logTime = moment(logTime)
      .startOf('month')
      .toDate();

    return tmp;
  },
  // init data bi thieu
  initShortageData: async function(app, loggers, current) {
    let startDayLog = await app.models.CtmConfig.getConfigByKey('startDayLog');
    for (let i = 0; i < loggers.length; i++) {
      let itemLogger = loggers[i];
      let data = await app.models.LogStatisticVolumeMonth.findOne({
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
          await app.models.LogStatisticVolumeMonth.create(tmp);
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
  // eslint-disable-next-line
  jobLogStatisticVolumeMonth: async function({ app, options }) {
    try {
      console.log('=== START Log statistic volume month ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.DataLogger.find({});

      let current = new Date();

      await funcLogs.initShortageData(app, loggers, current);

      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        let tmp = funcLogs.getDataRecord(itemLogger.id, current);
        let data = await app.models.LogStatisticVolumeMonth.findOne({
          where: {
            and: [
              { dataLoggerId: itemLogger.id },
              {
                logTime: moment(current)
                  .startOf('month')
                  .toDate(),
              },
            ],
          },
        });
        if (data) continue;
        await app.models.LogStatisticVolumeMonth.create(tmp);
      }
      console.log('=== END Log statistic volume month ===');
    } catch (e) {
      console.log('=== ERROR Log statistic volume month: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
