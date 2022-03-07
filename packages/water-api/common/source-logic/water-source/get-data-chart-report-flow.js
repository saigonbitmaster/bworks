'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');

module.exports = function(WaterSource) {
  WaterSource.getDataChartReportFlow = async function(filter) {
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
        // { $unwind: { path: '$dataLoggers', preserveNullAndEmptyArrays: true } },
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
        modelLog = 'RawWaterSourceVolume';
      } else {
        modelLog = 'RawWaterSourceVolumeDaily';
      }
      // 1 watersource se co nhieu datalogger
      for (let i = 0; i < waterSourceToDataLogger.length; i++) {
        let src = waterSourceToDataLogger[i];
        let item = {};
        item.id = src._id;
        item.name = src.name;
        item.loggers = [];
        for (let k = 0; k < src.dataLoggers.length; k++) {
          let logger = src.dataLoggers[k];
          let tmp = {};
          let cdt = {};
          cdt.where = {
            and: [{ dataLoggerId: logger._id }, { logTime: { between: [timeFrom, timeTo] } }],
          };
          if (type === 'hour') {
            cdt.fields = { id: true, flowRate: true, logTime: true };
          } else {
            cdt.fields = { id: true, rawData: true, logTime: true };
          }

          let data = await WaterSource.app.models[modelLog].find(cdt);
          tmp.id = logger._id;
          tmp.name = logger.name;
          if (data && data.length) {
            tmp.data = data;
            if (type === 'hour') {
              tmp.data = data;
            } else {
              let arr = [];
              for (let m = 0; m < data.length; m++) {
                let itemRaw = data[m].rawData;
                if (!itemRaw) continue;

                // format rawData
                Object.keys(itemRaw).forEach(function(key) {
                  let value = {};
                  value.flowRate = [itemRaw[key].minFlowRate, itemRaw[key].maxFlowRate];
                  value.logTime = itemRaw[key].logTime;
                  arr.push(value);
                });
              }
              tmp.data = arr;
            }
          } else {
            tmp.data = [];
          }
          item.loggers.push(tmp);
        }
        dataCollect.push(item);
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('getDataChartReportFlow', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
