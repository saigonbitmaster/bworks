'use strict';
const util = require('util');
const mapSeries = util.promisify(require('async/mapSeries'));
const { isEqual } = require('lodash');
const moment = require('moment-timezone');
const get = require('lodash/get');
const round = require('lodash/round');
// const number = require('../../utils/number');
const status = require('../../utils/status');
// eslint-disable-next-line no-unused-vars
module.exports = function(Dma) {
  Dma.getDmaTree = async (parentDmaId = '', excludeIds = null, deep = 3) => {
    let result = [];
    let dmas = await Dma.list(parentDmaId, excludeIds, deep);
    let stack = [];
    let item = null;
    do {
      item = null;
      if (stack.length) {
        item = stack.pop();
      } else if (dmas.length) {
        item = dmas.shift();
      } else {
        break;
      }
      if (item) {
        result.push(item);
        // check children
        let child;
        do {
          child = null;
          let childIndex = -1;
          dmas.some((dma, index) => {
            if (isEqual(dma.parentDmaId, item.id)) {
              child = dma;
              childIndex = index;
              return true;
            }
            return false;
          });
          if (childIndex >= 0) {
            dmas.splice(childIndex, 1);
            stack.push(child);
          }
        } while (child != null);
      }
    } while (item != null);
    return result;
  };

  Dma.currentStatus = async (mode = 'FlowLogger', deep = 3) => {
    let result = [];
    let dmas = await Dma.getDmaTree('', [], deep);
    let dmaIds = dmas.map(dma => dma.id);
    let loggers = await Dma.app.models.MaterialUse.find({
      where: { type: 'FlowLogger', dmaId: { in: dmaIds }, isDeleted: { neq: true } },
    });
    let loggerByDma = {};
    loggers.map(logger =>
      loggerByDma[logger.dmaId] ? loggerByDma[logger.dmaId].push(logger) : (loggerByDma[logger.dmaId] = [logger]),
    );
    // get lastest status
    let latestLogs = await Dma.app.models.LogFlowLoggerHour.latestStatus(loggers.map(logger => logger.optionKey));
    let latestLogByKey = {};
    latestLogs.map(log => {
      latestLogByKey[log.key] = log;
    });
    // convert
    await mapSeries(dmas, async dma => {
      let flowLoggers = [];
      let dmaData = {};
      if (loggerByDma[dma.id] && loggerByDma[dma.id].length) {
        flowLoggers = await mapSeries(loggerByDma[dma.id], async logger => {
          if (latestLogByKey[logger.optionKey]) {
            let data = {
              id: logger.id,
              name: logger.name,
              flowRate: round(get(latestLogByKey, `[${logger.optionKey}].flowRate`, 0), 1),
              pressure: round(get(latestLogByKey, `[${logger.optionKey}].pressure`, 0), 1),
              logTime: get(latestLogByKey, `[${logger.optionKey}].logTime`, null),
              isMiddle: logger.isMiddle,
              node: logger.node,
              optionKey: logger.optionKey,
            };
            data.status = await status.pressureLogger(logger, data, dma);
            data.timeStatus = await status.logTime(data.logTime);
            return data;
          }
          return { id: logger.id, name: logger.name, node: logger.node, optionKey: logger.optionKey || '' };
        });

        if (mode === 'Dma' && flowLoggers && flowLoggers.length) {
          let sumFlowRate = 0;
          let sumPressure = 0;
          let sumCount = 0;
          let logTime = moment()
            .subtract(1, 'year')
            .startOf('day');
          flowLoggers.map(item => {
            if (item.flowRate && item.pressure && !item.isMiddle) {
              sumFlowRate += item.flowRate;
              sumPressure += item.pressure;
              logTime = moment.max(logTime, moment(item.logTime));
              sumCount++;
            }
          });
          dmaData = {
            flowRate: round(sumFlowRate, 1), // luu luong => tinh tong
            pressure: round(sumPressure / sumCount, 1),
            logTime: logTime.toDate(),
          };
          dmaData.status = await status.pressureDma(dma, dmaData);
          dmaData.timeStatus = await status.logTime(dmaData.logTime);
        }
      }
      result.push({ ...dma.__data, flowLoggers, dmaData });
    });
    return result;
  };
  Dma.remoteMethod('currentStatus', {
    accepts: [
      { arg: 'mode', type: 'string', default: 'FlowLogger' },
      { arg: 'deep', type: 'number', default: 2 },
    ],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
