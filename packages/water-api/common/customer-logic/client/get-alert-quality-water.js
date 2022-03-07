'use strict';
const { groupBy, forEach, minBy, maxBy, get, flow } = require('lodash');
const objectHash = require('object-hash');
const slug = require('slug');
const moment = require('moment-timezone');
const utilCommon = require('../../utils/common');

// Process records worht of warning by unit of time (hour and day)
const processRecordsIntoWarnings = (logger, typeTime, typeQualityWater) => {
  if (!logger || !logger.meta || !logger.data) {
    return [];
  }

  const sluggifiedTypeQualityWater = slug(typeQualityWater.toLowerCase());
  const loggerName = logger.name;
  const config = get(logger, 'meta.quality', null).filter(
    i => slug(i.name.toLowerCase()) === slug(typeQualityWater.toLowerCase()),
  )[0];
  const loggerSelector = state => state.data;
  const groupByHourSelector = logItems => {
    return groupBy(logItems, logItem =>
      moment(logItem.logTime)
        .startOf(typeTime)
        .format('x'),
    );
  };
  const waterStandardMinMaxSelector = logGroupByHours => {
    const res = [];
    forEach(logGroupByHours, (logGroupByTime, key) => {
      if (logGroupByTime) {
        if (typeTime === 'hour') {
          res.push({
            time: parseInt(key),
            min: get(minBy(logGroupByTime, sluggifiedTypeQualityWater), sluggifiedTypeQualityWater),
            max: get(maxBy(logGroupByTime, sluggifiedTypeQualityWater), sluggifiedTypeQualityWater),
          });
        } else if (typeTime === 'day') {
          const minP = minBy(logGroupByTime, sluggifiedTypeQualityWater);
          const maxP = maxBy(logGroupByTime, sluggifiedTypeQualityWater);
          res.push({
            time: parseInt(key),
            min: get(minP, `${sluggifiedTypeQualityWater}[0]`),
            max: get(maxP, `${sluggifiedTypeQualityWater}[1]`),
            minTime: get(minP, 'logTime'),
            maxTime: get(maxP, 'logTime'),
          });
        }
      }
    });
    return res;
  };
  const notifySelector = waterStandardMinMaxByHours => {
    const notis = [];
    forEach(waterStandardMinMaxByHours, item => {
      // Add id to each record to avoid dataProvider error
      // low
      if (config.lowerLimit) {
        if (!config.lowerLimit || config.lowerLimitSymbol === '>=') {
          if (item.min <= config.lowerLimit) {
            const object = { time: item.time, loggerName, type: 'low', value: item.min };
            object.id = objectHash(object);
            notis.push(object);
          }
        } else if (config.lowerLimitSymbol === '>') {
          if (item.min < config.lowerLimit) {
            const object = { time: item.time, loggerName, type: 'low', value: item.min };
            object.id = objectHash(object);
            notis.push(object);
          }
        }
      }
      // high
      if (config.upperLimit) {
        if (!config.upperLimit || config.upperLimitSymbol === '<=') {
          if (item.min >= config.upperLimit) {
            const object = { time: item.time, loggerName, type: 'high', value: item.max };
            object.id = objectHash(object);
            notis.push(object);
          }
        } else if (config.upperLimitSymbol === '<') {
          if (item.min > config.upperLimit) {
            const object = { time: item.time, loggerName, type: 'high', value: item.max };
            object.id = objectHash(object);
            notis.push(object);
          }
        }
      }
    });

    return notis;
  };

  return flow(loggerSelector, groupByHourSelector, waterStandardMinMaxSelector, notifySelector)(logger);
};

module.exports = Client => {
  Client.getAlertQualityWater = async (filter, res, options) => {
    // Get data
    const loggerData = await Client.getInfoQualityWater(filter, res, options);
    const loggers = get(loggerData, '0.loggers', []);

    // Check input time type and input water standard type
    const typeTime = get(filter, 'where.typeTime', null);
    const typeQualityWater = get(filter, 'where.typeQualityWater', null);
    if (!typeTime || !typeQualityWater || !['hour', 'day'].includes(typeTime)) {
      res.header('Content-Range', 0);
      return [];
    }

    // Process upon each logger
    const notificationData = loggers.reduce((acc, val) => {
      const processedLoggerData = processRecordsIntoWarnings(val, typeTime, typeQualityWater);
      acc = acc.concat(processedLoggerData);
      return acc;
    }, []);

    // Return
    return utilCommon.filterData(filter, notificationData, res);
  };

  Client.remoteMethod('getAlertQualityWater', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
