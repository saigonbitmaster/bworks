const moment = require('moment-timezone');
const slug = require('slug');

// Constants
const TYPE_TIME = 'days';
const STEP = 1; // 1day
const MAX_RAW = 24; // 1ngay =>  24 record hour

// Schema for generated data
/*({
  min: {
    clo': 1,
    ntu: 2,
    ph: 3,
  },
  max: {
    clo: 1,
    ntu: 2,
    ph: 3,
  },
  avg: {
    clo: 1,
    ntu: 2,
    ph: 3,
  },
  rawData: {
    clo: [{ value: 1, logTime: new Date() }, { value: 2, logTime: new Date() }],
    ntu: [{ value: 1, logTime: new Date() }, { value: 2, logTime: new Date() }],
    ph: [{ value: 1, logTime: new Date() }, { value: 2, logTime: new Date() }],
  },
  key: 'DNA', // data logger id
  logTime: new Date(),
});

  clo: 0.3 ~> 0.5
  ntu: 0 ~> 5
  ph: 6.0 ~> 8.5
*/

const funcLogs = {
  randomNumber: (low, high) => {
    const offset = 1;
    // Check if either `low` or `high` figures are floaty
    if (low % 1 !== 0 || high % 1 !== 0) {
      return parseFloat((Math.random() * (high - low) + low).toFixed(2));
    } else {
      return Math.floor(Math.random() * (high - low + offset) + low);
    }
  },

  getDataRecord: (dataLoggerId, standards, logTime) => {
    const record = {};

    if (dataLoggerId && logTime) {
      record.key = dataLoggerId;
      record.logTime = moment(logTime)
        .startOf('day')
        .toDate();
      record.rawData = funcLogs.generateRawData(logTime, standards);

      const min = {};
      const max = {};
      const avg = {};

      for (let standardName of standards) {
        switch (standardName) {
          case 'clo': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['clo']['min']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['clo']['max']));
            min['clo'] = tmpMin;
            max['clo'] = tmpMax;
            avg['clo'] = parseFloat(((tmpMin + tmpMax) / 2).toFixed(2));
            break;
          }
          case 'ntu': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['ntu']['min']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['ntu']['max']));
            min['ntu'] = tmpMin;
            max['ntu'] = tmpMax;
            avg['ntu'] = parseFloat(((tmpMin + tmpMax) / 2).toFixed(2));
            break;
          }
          case 'ph': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['ph']['min']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['ph']['max']));
            min['ph'] = tmpMin;
            max['ph'] = tmpMax;
            avg['ph'] = parseFloat(((tmpMin + tmpMax) / 2).toFixed(2));
            break;
          }
        }
      }

      record.min = min;
      record.max = max;
      record.avg = avg;
    } else {
      for (let standardName of standards) {
        switch (standardName) {
          case 'clo': {
            record['clo'] = {
              min: funcLogs.randomNumber(0.3, 0.4),
              max: funcLogs.randomNumber(0.4, 0.5),
            };
            break;
          }
          case 'ntu': {
            record['ntu'] = {
              min: funcLogs.randomNumber(0, 3),
              max: funcLogs.randomNumber(3, 5),
            };
            break;
          }
          case 'ph': {
            record['ph'] = {
              min: funcLogs.randomNumber(6.0, 7.0),
              max: funcLogs.randomNumber(7.0, 8.5),
            };
            break;
          }
        }
      }
    }
    return record;
  },

  // init data bi thieu
  initShortageData: async (app, loggers, standardNames, current) => {
    for (const logger of loggers) {
      const loggerId = logger.id;
      const data = await app.models.DmaQualityWaterDaily.findOne({
        where: { key: loggerId },
        order: 'logTime DESC',
      });

      if (data) {
        const logTime = data.logTime;
        let start = moment(logTime);
        const end = moment(current);
        const diff = moment(start).diff(moment(end), TYPE_TIME);
        if (diff < 0) {
          start = start.add(STEP, TYPE_TIME);
          for (let time = start; moment(time).diff(moment(end), TYPE_TIME) < 0; ) {
            const tmp = funcLogs.getDataRecord(loggerId, standardNames, time);
            await app.models.DmaQualityWaterDaily.create(tmp);
            time = time.add(STEP, TYPE_TIME);
          }
        }
      }
    }
  },

  generateRawData: (logTime, standards) => {
    const rawData = [];
    for (let hour = 0; hour < MAX_RAW; hour++) {
      const rawDatum = funcLogs.getDataRecord(null, standards, null);
      rawDatum.logTime = moment(logTime)
        .startOf('day')
        .add(hour, 'hours')
        .toDate();
      rawData.push(rawDatum);
    }
    return rawData;
  },

  // eslint-disable-next-line
  jobQualityDaily: async ({ app, options }) => {
    try {
      // eslint-disable-next-line
      console.log('=== START jobQualityDaily ===', moment().format('YYYY/MM/DD HH:mm:ss'));

      // Get loggers
      const loggers = await app.models.MaterialUse.find({
        where: { type: 'FlowLogger', health: 'OK' },
        fields: { optionKey: 1 },
      }).then(loggers => loggers.map(({ optionKey }) => ({ id: optionKey })));
      const domesticWaterStandards = await app.models.NmsConfig.findById('DomesticWaterStandard');
      const domesticWaterStandardNames = (domesticWaterStandards.value || []).map(std => slug(std.name.toLowerCase()));
      const current = options.current || new Date();

      // await funcLogs.initShortageData(app, loggers, domesticWaterStandardNames, current);

      for (const logger of loggers) {
        const loggerId = logger.id;
        for (
          let day = moment(current).startOf('month');
          moment(day).isBefore(moment(current).endOf('month'));
          day = moment(day).add(1, 'day')
        ) {
          const tmp = funcLogs.getDataRecord(loggerId, domesticWaterStandardNames, day);
          const data = await app.models.DmaQualityWaterDaily.findOne({
            where: {
              and: [
                { key: loggerId },
                {
                  logTime: moment(day)
                    .startOf('day')
                    .toDate(),
                },
              ],
            },
          });
          if (!data) {
            await app.models.DmaQualityWaterDaily.create(tmp);
          }
        }
      }
      // eslint-disable-next-line
      console.log('=== END jobQualityDaily ===');
    } catch (error) {
      // eslint-disable-next-line
      console.log('=== ERROR jobQualityDaily: ', error);
      throw error;
    }
  },
};
module.exports = funcLogs;
