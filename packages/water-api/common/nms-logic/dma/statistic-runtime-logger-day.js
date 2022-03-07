'use strict';
const util = require('util');
// const ObjectID = require('mongodb').ObjectID;
const eachSeries = util.promisify(require('async/eachSeries'));
const { round } = require('lodash');
// const moment = require('moment-timezone');
// const createError = require('http-errors');
// const aggregate = require('../../utils/aggregate');

module.exports = function(Dma) {
  Dma.statisticRuntimeLoggerDay = async (dmaId, from, to) => {
    let loggerByDma = await Dma.getLoggerByDma(dmaId);
    if (loggerByDma && loggerByDma.length) {
      // get pressure config
      let pressureConfig = (await Dma.app.models.NmsConfig.findById('Pressure')) || {};
      // get value only
      pressureConfig = pressureConfig.value;
      // calculate foreach dma
      await eachSeries(loggerByDma, async dma => {
        if (dma.loggers && dma.loggers.length) {
          await eachSeries(dma.loggers, async logger => {
            const [
              {
                average: [{ avgTotalPressure = null }],
                data = [],
              },
            ] = (await Dma.app.models.MaterialUse.statisticRuntimeLoggerDay(logger._id, from, to)) || [];
            logger.data = data;
            logger.averagePressure = avgTotalPressure;
            if (pressureConfig) {
              logger.meta = {
                pressure: {
                  loss: round((pressureConfig.loss.value * dma.designPressure) / 100, 2),
                  low: round((pressureConfig.low.value * dma.designPressure) / 100, 2),
                  high: round((pressureConfig.high.value * dma.designPressure) / 100, 2),
                },
              };
            }
          });
        }
      });
    }
    return loggerByDma;
  };
  Dma.remoteMethod('statisticRuntimeLoggerDay', {
    accepts: [
      { arg: 'dmaId', type: 'string' },
      { arg: 'from', type: 'date', required: true },
      { arg: 'to', type: 'date', required: true },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { verb: 'get' },
  });
};
