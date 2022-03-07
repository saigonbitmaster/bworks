'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const aggregate = require('../../utils/aggregate');
module.exports = function(MaterialUse) {
  MaterialUse.nmsGetDataChartReportQuality = async function(filter) {
    try {
      let dataCollect = [];
      let { dmaId, timeRange, waterParameter, loggerId, flgSub } = filter;
      if (flgSub) {
        let logger = await MaterialUse.findById(loggerId);
        if (logger) {
          dmaId = logger.dmaId;
        }
      }
      if (!dmaId || !timeRange || !waterParameter || !loggerId) {
        return dataCollect;
      }
      let { type, from, to } = timeRange;
      if (!type || !from || !to) {
        return dataCollect;
      }
      let ids = [];
      let dmas = [];
      if (loggerId === 'all') {
        //chon tat ca logger
        if (dmaId === 'all' || dmaId === 'AllDma') {
          let cdt = {};
          cdt.where = {};
          cdt.fields = { id: true, name: true };
          cdt.limit = 1000;
          let tmp = await MaterialUse.app.models.Dma.find(cdt);
          ids = tmp.map(item => new ObjectID(item.id));
        } else {
          ids.push(new ObjectID(dmaId));
        }

        let queryLogger = [
          { $match: { _id: { $in: ids } } },
          { $project: { id: 1, name: 1 } },
          {
            $lookup: {
              from: 'MaterialUse',
              let: { id: '$_id' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ['$dmaId', '$$id'] }, { $eq: ['$type', 'QualityLogger'] }],
                    },
                  },
                },
                { $project: { id: 1, name: 1, waterParameter: 1, optionKey: 1 } },
              ],
              as: 'loggers',
            },
          },
          // { $unwind: { path: '$dataLoggers', preserveNullAndEmptyArrays: true } },
        ];

        dmas = await aggregate(MaterialUse.app.models.Dma, queryLogger);
      } else {
        // chon 1 logger
        let logger = await MaterialUse.findById(loggerId);
        if (!logger || !logger.dmaId || !logger.waterParameter) {
          return dataCollect;
        }
        let dma = await MaterialUse.app.models.Dma.findById(logger.dmaId);
        if (!dma) {
          return dataCollect;
        }
        dmas.push({
          _id: dma.id,
          name: dma.name,
          loggers: [
            {
              _id: logger.id,
              name: logger.name,
              optionKey: logger.optionKey,
              waterParameter: logger.waterParameter,
            },
          ],
        });
      }

      if (!dmas || !dmas.length) {
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
        modelLog = 'NmsLogWaterQualityHourly';
      } else {
        modelLog = 'NmsLogWaterQualityDaily';
      }
      // 1 dma se co nhieu qualitylogger
      for (let i = 0; i < dmas.length; i++) {
        let dma = dmas[i];
        let item = {};
        item.id = dma._id;
        item.name = dma.name;
        item.loggers = [];
        for (let k = 0; k < dma.loggers.length; k++) {
          let logger = dma.loggers[k];
          let tmp = {};
          let cdt = {};
          cdt.where = {
            and: [{ waterParameter }, { dataLoggerId: logger._id }, { logTime: { between: [timeFrom, timeTo] } }],
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
                  value[waterParameter] = itemRaw[key].value;
                } else {
                  value[waterParameter] = [itemRaw[key].minValue, itemRaw[key].maxValue];
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

  MaterialUse.remoteMethod('nmsGetDataChartReportQuality', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
