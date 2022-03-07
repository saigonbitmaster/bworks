'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');
const get = require('lodash/get');
module.exports = function(WaterSource) {
  WaterSource.getDataChartStatisticQuality = async function(filter) {
    try {
      // console.log('filter', filter);
      let dataCollect = [];

      // waterSource: 'all' or id(string)
      let { waterSource, timeRange } = filter;
      if (!waterSource || !timeRange) {
        return dataCollect;
      }
      let { type, from, to } = timeRange;
      if (!type || !from || !to) {
        return dataCollect;
      }
      // get info many parameters
      let parameters = await WaterSource.app.models.WaterParameter.find({ limit: 1000 });
      if (!parameters) {
        return dataCollect;
      }

      let ids = [];
      if (waterSource === 'all') {
        let cdt = {};
        cdt.where = {};
        cdt.fields = { id: true, name: true };
        cdt.limit = 1000;
        let tmp = await WaterSource.find(cdt);
        ids = tmp.map(item => new ObjectID(item.id));
      } else {
        ids.push(new ObjectID(waterSource));
      }

      let queryDataLogger = [
        { $match: { _id: { $in: ids } } },
        { $project: { id: 1, name: 1 } },
        {
          $lookup: {
            from: 'DataLogger',
            localField: '_id',
            foreignField: 'waterSourceId',
            as: 'dataLoggers',
          },
        },
        {
          $lookup: {
            from: 'AlertThreshold',
            localField: '_id',
            foreignField: 'waterSourceId',
            as: 'alertThresholds',
          },
        },
      ];

      let waterSourceToDataLogger = await aggregate(WaterSource, queryDataLogger);
      if (!waterSourceToDataLogger || !waterSourceToDataLogger.length) {
        return dataCollect;
      }
      // console.log(waterSourceToDataLogger);

      let timeFrom = moment(from)
        .startOf('day')
        .toDate();
      let timeTo = moment(to)
        .endOf('day')
        .toDate();
      let modelLog;
      if (type === 'hour') {
        modelLog = 'WaterQualityHourly';
      } else {
        modelLog = 'WaterQualityDaily';
      }
      // 1 watersource se co nhieu datalogger
      for (let i = 0; i < waterSourceToDataLogger.length; i++) {
        let src = waterSourceToDataLogger[i];
        let alertThresholds = src.alertThresholds;
        let dataLoggers = src.dataLoggers;

        let item = {};
        item.id = src._id;
        item.name = src.name;
        item.loggers = [];

        for (let k = 0; k < dataLoggers.length; k++) {
          let logger = dataLoggers[k];
          for (let m = 0; m < alertThresholds.length; m++) {
            let alertThreshold = alertThresholds[m];
            let waterParameterId = get(alertThreshold, 'waterParameterId');
            if (!waterParameterId) continue;
            let tmp = {};
            let cdt = {};
            cdt.where = {
              and: [{ waterParameterId }, { dataLoggerId: logger._id }, { logTime: { between: [timeFrom, timeTo] } }],
            };
            cdt.fields = { id: true, logTime: true, minValue: true, maxValue: true };

            let data = await WaterSource.app.models[modelLog].find(cdt);
            if (!data) {
              continue;
            }
            tmp.id = logger._id;
            tmp.name = logger.name;
            tmp.waterParameterId = waterParameterId;
            tmp.waterParameter = get(alertThreshold, 'name');
            if (data && data.length) {
              for (let y = 0; y < data.length; y++) {
                let item = data[y];
                let alert = WaterSource.checkAlert(item.minValue, item.maxValue, alertThreshold);
                data[y].alert = alert;
              }
              tmp.data = data;
            } else {
              tmp.data = [];
            }
            item.loggers.push(tmp);
          }
        }
        dataCollect.push(item);
      }
      if (!dataCollect.length) return [];

      // console.log('========datacollect========', dataCollect);
      let maxTime = 0;
      if (type === 'hour') {
        maxTime = 24;
      } else {
        maxTime = moment(timeTo).diff(moment(timeFrom), 'days') + 1;
      }
      let dataFinal = [];
      let length = dataCollect.length;
      if (length) {
        // duyet qua tung watersource(1 watersource co cac datalogger va cac waterparameter tuong ung)
        for (let i = 0; i < length; ++i) {
          let waterSource = dataCollect[i];
          let loggers = waterSource.loggers;
          let data = [];
          for (let m = 0; m < maxTime; m++) {
            let arrItems = [];
            let logTime;
            for (let k = 0; k < loggers.length; k++) {
              let data = loggers[k].data[m];
              if (!data) continue;
              logTime = data.logTime;
              arrItems.push(data);
            }
            if (arrItems.length) {
              let resAlert = WaterSource.compareAlert(arrItems);
              data.push({
                logTime,
                alert: resAlert,
                index: 1,
              });
            }
          } // end time
          dataFinal.push({
            id: waterSource.id,
            name: waterSource.name,
            data: data,
          });
        }
      }
      return dataFinal;
    } catch (e) {
      throw e;
    }
  };

  // return:
  // 0: binh thuong
  // 1: canh bao nguy cap
  // 2: canh bao
  WaterSource.compareAlert = function(data) {
    // alert ===  1: alertCriticalHigh
    // alert ===  2: alertHigh
    // alert ===  3: alertLow
    // alert ===  4: alertCriticalLow
    let res = 0;
    for (let i = 0; i < data.length; i++) {
      let alert = data[i].alert;
      if (alert === 1 || alert === 4) return 1;
      if (alert === 2 || alert === 3) res = 2;
    }
    return res;
  };

  // return:
  // >= alertCriticalHigh: 1
  // >= alertHigh: 2
  // <= alertLow: 3
  // <= alertCriticalLow: 4
  WaterSource.checkAlert = function(min, max, alertThreshold) {
    let alertHigh = get(alertThreshold, 'alertHigh');
    let alertCriticalHigh = get(alertThreshold, 'alertCriticalHigh');
    let alertLow = get(alertThreshold, 'alertLow');
    let alertCriticalLow = get(alertThreshold, 'alertCriticalLow');

    if (!alertCriticalHigh || !alertHigh || !alertLow || !alertCriticalLow) return 0;

    // >= alertCriticalHigh: 1
    // >= alertHigh: 2
    // <= alertLow: 3
    // <= alertCriticalLow: 4

    // nguong cao
    if (min >= alertCriticalHigh) {
      return 1;
    } else if (min >= alertHigh) {
      return 2;
    } else if (max >= alertCriticalHigh) {
      return 1;
    } else if (max >= alertHigh) {
      return 2;

      // nguong thap
    } else if (max <= alertCriticalLow) {
      return 4;
    } else if (max <= alertLow) {
      return 3;
    } else if (min <= alertCriticalLow) {
      return 4;
    } else if (min <= alertLow) {
      return 3;
    }

    // binh thuong
    return 0;
  };

  WaterSource.remoteMethod('getDataChartStatisticQuality', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
