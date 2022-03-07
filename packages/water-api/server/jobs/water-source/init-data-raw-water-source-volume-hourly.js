const moment = require('moment-timezone');
const typeTime = 'minutes';
const numMinute = 1;
const funcLogs = {
  randomIntInc: function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
  },
  getDataRecord: function(dataLoggerId, logTime) {
    let tmp = {};
    // tmp.ph = Math.floor(Math.random() * 3 + 4); // 4 - 8
    // tmp.ntu = Math.floor(Math.random() * 3 + 5); // 4 - 6
    // tmp.cod = Math.floor(Math.random() * 3 + 6); // 4 - 6
    tmp.ph = funcLogs.randomIntInc(1, 7); // 1 - 7
    tmp.ntu = funcLogs.randomIntInc(1, 4); // 1 - 4
    tmp.cod = funcLogs.randomIntInc(1, 6); // 1 - 6

    // generate ap luc
    tmp.flowRate = funcLogs.randomIntInc(200, 350);

    tmp.volume = Math.floor(Math.random() * 10000 + 10000000);
    tmp.dataLoggerId = dataLoggerId;
    tmp.logTime = moment(logTime);
    return tmp;
  },
  // init data bi thieu
  initShortageData: async function(app, loggers, current) {
    let startDayLog = (await app.models.CtmConfig.getConfigByKey('startDayLog')) || {
      value: moment().subtract(6, 'months'),
    };
    for (let i = 0; i < loggers.length; i++) {
      let itemLogger = loggers[i];
      // console.log('itemLogger: ', itemLogger.id);
      let data = await app.models.RawWaterSourceVolume.findOne({
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
        start = start.add(numMinute, typeTime);
        let count = 0;
        for (let time = start; moment(time).diff(moment(end), typeTime) < 0; ) {
          let tmp = funcLogs.getDataRecord(itemLogger.id, time);
          await app.models.RawWaterSourceVolume.create(tmp);
          time = time.add(numMinute, typeTime);
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
  jobRawWaterSourceVolume: async function({ app, options }) {
    try {
      console.log('=== START jobRawWaterSourceVolume hourly ===', moment().format('YYYY/MM/DD HH:mm:ss'));
      let loggers = await app.models.DataLogger.find({});
      let current = new Date();
      // console.log('current time: ', current);
      await funcLogs.initShortageData(app, loggers, current);
      for (let i = 0; i < loggers.length; i++) {
        let itemLogger = loggers[i];
        // if (!itemLogger.id.equals('5be79e116c225b401e1f89e1')) continue;
        let tmp = funcLogs.getDataRecord(itemLogger.id, current);
        let data = await app.models.RawWaterSourceVolume.findOne({
          where: {
            and: [
              { dataLoggerId: itemLogger.id },
              {
                logTime: current,
              },
            ],
          },
        });
        if (data) continue;
        await app.models.RawWaterSourceVolume.create(tmp);
      }
      console.log('=== END jobRawWaterSourceVolume hourly===');
    } catch (e) {
      console.log('=== ERROR jobRawWaterSourceVolume hourly: ', e);
      throw e;
    }
  },
};
module.exports = funcLogs;
