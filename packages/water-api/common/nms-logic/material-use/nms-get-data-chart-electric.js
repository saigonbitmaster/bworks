'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');
module.exports = function(MaterialUse) {
  MaterialUse.nmsGetDataChartElectric = async function(filter) {
    try {
      let dataCollect = [];
      let { timeRange, pumpId, loggerId, pumpStationId } = filter;
      if (!pumpId || !timeRange || !loggerId) {
        return dataCollect;
      }
      let { type, from, to } = timeRange;
      if (!type || !from || !to) {
        return dataCollect;
      }
      let ids = [];
      let pumps = [];
      let tmp = [];
      if (loggerId === 'all') {
        // chon tat ca logger
        let cdt = {};
        cdt.where = { type: 'Pump' };
        cdt.fields = { id: true, name: true, type: true };
        // cdt.limit = 1000;
        tmp = await MaterialUse.find(cdt);
        ids = tmp.map(item => new ObjectID(item.id));

        // ids.push(new ObjectID(loggerId));
      } else {
        ids.push(new ObjectID(loggerId));
      }

      let queryLogger = [
        { $match: { _id: { $in: ids } } },
        { $project: { id: 1, name: 1, electricLoggerId: true } },
        {
          $lookup: {
            from: 'MaterialUse',
            let: { electricLoggerId: '$electricLoggerId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [{ $eq: ['$$electricLoggerId', '$_id'] }],
                  },
                },
              },
              { $project: { id: 1, name: 1, optionKey: 1, dmaId: true, health: 1 } },
            ],
            as: 'loggers',
          },
        },
        // { $unwind: { path: '$dataLoggers', preserveNullAndEmptyArrays: true } },
      ];

      pumps = await aggregate(MaterialUse, queryLogger);

      if (!pumps || !pumps.length) {
        return dataCollect;
      }
      // console.log(dmas);

      let timeFrom = moment(from)
        .startOf('day')
        .toDate();
      let timeTo = moment(to)
        .endOf('day')
        .toDate();
      let modelLog;
      if (type === 'hour') {
        modelLog = 'NmsLogElectricHourly';
      } else {
        modelLog = 'NmsLogElectricDaily';
      }

      for (let i = 0; i < pumps.length; i++) {
        let pump = pumps[i];
        let item = {};
        item.id = pump._id;
        item.name = pump.name;
        item.loggers = [];
        for (let k = 0; k < pump.loggers.length; k++) {
          let logger = pump.loggers[k];
          let tmp = {};
          let cdt = {};
          cdt.where = {
            and: [{ dataLoggerId: logger._id }, { logTime: { between: [timeFrom, timeTo] } }],
          };
          cdt.fields = { id: true, rawData: true, logTime: true };

          let data = await MaterialUse.app.models[modelLog].find(cdt);
          tmp.id = logger._id;
          tmp.name = logger.name;
          tmp.optionKey = logger.optionKey;
          if (data && data.length) {
            let arr = [];
            for (let m = 0; m < data.length; m++) {
              let itemRaw = data[m].rawData;
              if (!itemRaw) continue;

              // format rawData
              Object.keys(itemRaw).forEach(function(key) {
                let value = {};
                if (type === 'hour') {
                  value.electric = itemRaw[key].value;
                } else {
                  value.electric = [itemRaw[key].minValue, itemRaw[key].maxValue];
                }
                value.logTime = itemRaw[key].logTime;
                arr.push(value);
              });
            }
            tmp.data = arr;
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

  MaterialUse.remoteMethod('nmsGetDataChartElectric', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
