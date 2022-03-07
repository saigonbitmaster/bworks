'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');
const sumBy = require('lodash/sumBy');
module.exports = function(WaterSource) {
  WaterSource.getDataChartStatisticVolume = async function(filter) {
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
        .startOf('month')
        .toDate();
      let timeTo = moment(to)
        .endOf('month')
        .toDate();
      let modelLog = 'LogStatisticVolumeMonth';

      let startTime = timeFrom;

      while (startTime <= timeTo) {
        let stopTime = moment(startTime)
          .add(1, 'month')
          .toDate();

        // 1 thang co nhieu watersource
        let item = {};
        item.time = startTime;

        // 1 watersource se co nhieu datalogger
        for (let i = 0; i < waterSourceToDataLogger.length; i++) {
          let src = waterSourceToDataLogger[i];

          item[src.name] = 0; // source water

          let volume = 0;

          for (let k = 0; k < src.dataLoggers.length; k++) {
            let logger = src.dataLoggers[k];
            let cdt = {};
            cdt.where = {
              and: [{ dataLoggerId: logger._id }, { logTime: { between: [startTime, stopTime] } }],
            };
            cdt.fields = { id: true, volume: true };

            let data = await WaterSource.app.models[modelLog].find(cdt);
            if (data && data.length) {
              volume += sumBy(data, 'volume');
            }
          }
          item[src.name] = volume;
        }

        // 1 thang 1 record
        dataCollect.push(item);

        // next
        startTime = stopTime;
      }

      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('getDataChartStatisticVolume', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
