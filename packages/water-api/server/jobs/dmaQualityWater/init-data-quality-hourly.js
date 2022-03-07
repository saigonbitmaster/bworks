const moment = require('moment-timezone');
const slug = require('slug');

// Constants
// const TYPE_TIME = 'hours';
// const STEP = 1; // 1h
const MAX_DAY = 2; // chi sinh du lieu cho 3 ngay: ngay hom kia, ngay hom qua va hom nay
const MAX_RAW = 60; // trong 1h, cu 5 phut la ra 1 record

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
        .startOf('hour')
        .toDate();
      record.rawData = funcLogs.generateRawData(logTime, standards);

      const min = {};
      const max = {};
      const avg = {};

      for (let standardName of standards) {
        switch (standardName) {
          case 'clo': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['clo']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['clo']));
            min['clo'] = tmpMin;
            max['clo'] = tmpMax;
            avg['clo'] = parseFloat(((tmpMin + tmpMax) / 2).toFixed(2));
            break;
          }
          case 'ntu': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['ntu']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['ntu']));
            min['ntu'] = tmpMin;
            max['ntu'] = tmpMax;
            avg['ntu'] = parseFloat(((tmpMin + tmpMax) / 2).toFixed(2));
            break;
          }
          case 'ph': {
            const tmpMin = Math.min(...record.rawData.map(datum => datum['ph']));
            const tmpMax = Math.max(...record.rawData.map(datum => datum['ph']));
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
            record['clo'] = funcLogs.randomNumber(0.2, 0.6);
            break;
          }
          case 'ntu': {
            record['ntu'] = funcLogs.randomNumber(0.1, 6);
            break;
          }
          case 'ph': {
            record['ph'] = funcLogs.randomNumber(5.0, 9.5);
            break;
          }
        }
      }
    }

    return record;
  },

  generateRawData: (logTime, standards) => {
    const rawData = [];
    for (let minute = 0; minute < MAX_RAW; minute += 5) {
      const rawDatum = funcLogs.getDataRecord(null, standards, null);
      rawDatum.logTime = moment(logTime)
        .startOf('hour')
        .add(minute, 'minutes')
        .toDate();
      rawData.push(rawDatum);
    }
    return rawData;
  },

  // eslint-disable-next-line
  jobQualityHourly: async ({ app, options }) => {
    try {
      // eslint-disable-next-line
      console.log('=== START jobQualityHourly ===', moment().format('YYYY/MM/DD HH:mm:ss'));

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
          let day = moment(current)
            .subtract(MAX_DAY, 'days')
            .startOf('day');
          moment(day).isBefore(moment(current));
          day = moment(day).add(1, 'day')
        ) {
          for (
            let hour = moment(day).startOf('day');
            moment(hour).isBefore(moment(day).endOf('day'));
            hour = moment(hour).add(1, 'hour')
          ) {
            const tmp = funcLogs.getDataRecord(loggerId, domesticWaterStandardNames, hour);
            const data = await app.models.DmaQualityWaterHourly.findOne({
              where: {
                and: [
                  { key: loggerId },
                  {
                    logTime: moment(hour)
                      .startOf('hour')
                      .toDate(),
                  },
                ],
              },
            });
            if (!data) {
              await app.models.DmaQualityWaterHourly.create(tmp);
            }
          }
        }
      }
      // eslint-disable-next-line
      console.log('=== END jobQualityHourly ===');
    } catch (error) {
      // eslint-disable-next-line
      console.log('=== ERROR jobQualityHourly: ', error);
      throw error;
    }
  },
};
module.exports = funcLogs;
