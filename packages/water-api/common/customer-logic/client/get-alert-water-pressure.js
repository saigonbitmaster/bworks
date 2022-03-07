'use strict';
const { groupBy, forEach, minBy, maxBy, get, flow } = require('lodash');
const objectHash = require('object-hash');
const moment = require('moment-timezone');
const utilCommon = require('../../utils/common');

// Process records worth of warning by unit of time (hour and day)
const processRecordsIntoWarnings = (logger, typeTime) => {
  if (!logger || !logger.meta || !logger.data) return [];

  const loggerName = logger.name;
  const config = logger.meta.pressure;
  const loggerSelector = state => state.data;
  const groupByHourSelector = logItems => {
    return groupBy(logItems, logItem =>
      moment(logItem.logTime)
        .startOf(typeTime)
        .format('x'),
    );
  };
  const flowMinMaxSelector = logGroupByHours => {
    const res = [];
    forEach(logGroupByHours, (logGroupByTime, key) => {
      if (logGroupByTime) {
        if (typeTime === 'hour') {
          res.push({
            time: parseInt(key),
            min: get(minBy(logGroupByTime, 'pressure'), 'pressure'),
            max: get(maxBy(logGroupByTime, 'pressure'), 'pressure'),
          });
        } else if (typeTime === 'day') {
          const minP = minBy(logGroupByTime, 'pressure');
          const maxP = maxBy(logGroupByTime, 'pressure');
          res.push({
            time: parseInt(key),
            min: get(minP, 'pressure[0]'),
            max: get(maxP, 'pressure[1]'),
            minTime: get(minP, 'logTime'),
            maxTime: get(maxP, 'logTime'),
          });
        }
      }
    });
    return res;
  };
  const notifySelector = pressureMinMaxByHours => {
    const notis = [];
    forEach(pressureMinMaxByHours, item => {
      // Add id to each record to avoid dataProvider error
      if (item.min < config.loss) {
        // loss
        const object = {
          time: item.time,
          loggerName,
          type: 'loss',
          value: item.min,
        };
        object.id = objectHash(object);
        notis.push(object);
      } else if (item.min < config.low) {
        // low
        const object = {
          time: item.time,
          loggerName,
          type: 'low',
          value: item.min,
        };
        object.id = objectHash(object);
        notis.push(object);
      } else if (item.max > config.high) {
        // high
        const object = {
          time: item.time,
          loggerName,
          type: 'high',
          value: item.max,
        };
        object.id = objectHash(object);
        notis.push(object);
      }
    });

    return notis;
  };

  return flow(loggerSelector, groupByHourSelector, flowMinMaxSelector, notifySelector)(logger);
};

module.exports = Client => {
  Client.getAlertWaterPressure = async (filter, res, options) => {
    // Get data
    const loggerData = await Client.getInfoWaterPressure(filter, res, options);
    const loggers = get(loggerData, '0.loggers', []);

    // Check input time type
    const typeTime = get(filter, 'where.typeTime', null);
    if (!typeTime || !['hour', 'day'].includes(typeTime)) {
      res.header('Content-Range', 0);
      return [];
    }

    // Process upon each logger
    const notificationData = loggers.reduce((acc, val) => {
      const processedLoggerData = processRecordsIntoWarnings(val, typeTime);
      acc = acc.concat(processedLoggerData);
      return acc;
    }, []);

    // Return
    return utilCommon.filterData(filter, notificationData, res);
  };

  // site: ctm-client => get canh bao ap luc, dung cho LIST
  Client.remoteMethod('getAlertWaterPressure', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
