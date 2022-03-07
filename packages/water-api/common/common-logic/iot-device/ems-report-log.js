'use strict';
const util = require('util');
const eachOfSeries = util.promisify(require('async/eachOfSeries'));
const _ = require('lodash');
// const filterNodes = require('loopback-filters');
// const utils = require('loopback/lib/utils');
// const PassThrough = require('stream').PassThrough;
const moment = require('moment-timezone');

module.exports = function(Iotdevice) {
  Iotdevice.beforeRemote('emsReportLog', Iotdevice.verify);
  Iotdevice.emsReportLog = async payload => {
    const result = { create: 0, update: 0, error: 0 };
    // group by key and hour
    const emsDevices = _.groupBy(payload, item => `${item.key}-${moment(item.time).format('YYMMDDHH')}`);
    // group by hour
    await eachOfSeries(emsDevices, async (logItems, id) => {
      // update LogFlowLoggerHour
      let logFlowLoggerHour = await Iotdevice.app.models.LogFlowLoggerHour.findById(id);
      const rawData = logFlowLoggerHour ? logFlowLoggerHour.rawData || {} : {};
      logItems.map(logItem => {
        const { time = null, flowRate = 0, flowAcc = 0, battery = 0, pressure = 0 } = logItem;
        if (time) {
          const minute = moment(time)
            .minutes()
            .toString();
          rawData[minute] = { flowRate, flow: flowAcc, battery, pressure };
        }
      });
      const logTime = moment(logItems[0].time).startOf('hour');
      const arrs = _.values(rawData);
      // re calculate
      const dataUpdate = {
        id,
        key: logItems[0].key,
        step: 'init',
        updatedDate: new Date(),
        logTime: logTime.toDate(),
        minFlowRate: _.get(
          _.minBy(arrs, o => o.flowRate),
          'flowRate',
          0,
        ),
        avgFlowRate: _.meanBy(arrs, o => o.flowRate),
        maxFlowRate: _.get(
          _.maxBy(arrs, o => o.flowRate),
          'flowRate',
          0,
        ),
        minPressure: _.get(
          _.minBy(arrs, o => o.pressure),
          'pressure',
          0,
        ),
        avgPressure: _.meanBy(arrs, o => o.pressure),
        maxPressure: _.get(
          _.maxBy(arrs, o => o.pressure),
          'pressure',
          0,
        ),
        maxFlow: _.get(
          _.maxBy(arrs, o => o.flow),
          'flow',
          0,
        ),
        minBattery: _.get(
          _.maxBy(arrs, o => o.battery),
          'battery',
          0,
        ),
        minLogTime: logTime,
        maxLogTime: moment(logTime)
          .endOf('hour')
          .toDate(),
        rawData,
      };
      if (logFlowLoggerHour) {
        await logFlowLoggerHour.updateAttributes(dataUpdate);
        result.update += 1;
      } else {
        await Iotdevice.app.models.LogFlowLoggerHour.create(dataUpdate);
        result.create += 1;
      }
    });
    return result;
  };

  Iotdevice.remoteMethod('emsReportLog', {
    description: 'Update log data from ems services',
    accessType: 'WRITE',
    accepts: [
      {
        arg: 'payload',
        type: ['object'],
      },
      // { arg: 'x-device-key', type: 'string', http: { source: 'header' } },
    ],
    http: {
      verb: 'post',
    },
    returns: { arg: 'body', type: 'object', root: true },
  });
};
