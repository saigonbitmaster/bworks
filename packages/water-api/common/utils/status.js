'use strict';
const { clone } = require('lodash');
const moment = require('moment-timezone');
const app = require('../../server/server');
const number = require('../utils/number');
let cache = {};
const defaultConfig = {
  Pressure: {
    id: 'Pressure',
    side: 'all',
    value: {
      high: { condition: '>', value: 20 },
      low: { condition: '<', value: 20 },
      loss: { condition: '<', value: 90 },
    },
  },
  LastLogTime: {
    id: 'LastLogTime',
    side: 'all',
    value: {
      error: { value: 5 }, // delay hours
      warning: { value: 3 }, // delay hours
    },
  },
};

const getConfig = async configKey => {
  // check cache
  let configTimeout = parseInt(app.get('ConfigTimeout') || 5); // minute
  let config;
  if (!cache[configKey] || moment().diff(cache[configKey].timeout, 'm') > configTimeout) {
    let data = await app.models.NmsConfig.findById(configKey);
    data = clone(data ? data.__data : defaultConfig[configKey]);
    cache[configKey] = data;
  }
  config = cache[configKey];
  return config;
};
const pressureLogger = async (logger, data, dma) => {
  let status = 'ok';
  let config = await getConfig('Pressure');
  let designPressure;
  if (!isNaN(logger.designPressure)) {
    designPressure = number.parseFloatPositive(logger.designPressure);
  } else {
    designPressure = number.parseFloatPositive(dma.designPressure);
  }
  let keys = Object.keys(config.value);
  keys.some(key => {
    let configCase = config.value[key];
    let check;
    if (configCase.condition.indexOf('<') >= 0) {
      check = eval(
        `${data.pressure} ${configCase.condition} ${designPressure *
          (1 - number.parseFloatPositive(configCase.value))}`,
      );
    } else {
      check = eval(
        `${data.pressure} ${configCase.condition} ${designPressure *
          (1 + number.parseFloatPositive(configCase.value))}`,
      );
    }
    if (check) {
      status = key;
      return true;
    }
    return false;
  });
  return status;
};

const pressureDma = async (dma, data) => {
  let status = 'ok';
  let config = await getConfig('Pressure');
  let designPressure;
  if (!isNaN(dma.designPressure)) {
    designPressure = number.parseFloatPositive(dma.designPressure);
  } else {
    designPressure = number.parseFloatPositive(dma.designPressure);
  }
  let keys = Object.keys(config.value);
  keys.some(key => {
    let configCase = config.value[key];
    let check;
    if (configCase.condition.indexOf('<') >= 0) {
      check = eval(
        `${data.pressure} ${configCase.condition} ${designPressure *
          (1 - number.parseFloatPositive(configCase.value))}`,
      );
    } else {
      check = eval(
        `${data.pressure} ${configCase.condition} ${designPressure *
          (1 + number.parseFloatPositive(configCase.value))}`,
      );
    }
    if (check) {
      status = key;
      return true;
    }
    return false;
  });
  return status;
};

const logTime = async time => {
  let status = 'ok';
  let config = await getConfig('LastLogTime');
  let keys = Object.keys(config.value);
  keys.some(key => {
    let configCase = config.value[key];
    let result = moment().diff(time, 'hour') > configCase.value;
    if (result) {
      status = key;
    }
    return result;
  });
  return status;
};

const waterLossDma = async (dma, input, loss) => {
  if (!dma || isNaN(input) || isNaN(loss)) {
    return 'error';
  }
  let config = await getConfig('DmaWaterLoss');
  if (config) {
    ['high', 'low'].map(key => {
      let configCase = config.value[key];
      if (configCase) {
        let check = eval(`${input} ${configCase.condition} ${(loss * parseFloat(configCase.value)) / 100}`);
        if (check) {
          return key;
        }
      }
    });
  }
  return 'ok';
};

module.exports = { pressureDma, waterLossDma, pressureLogger, logTime };
