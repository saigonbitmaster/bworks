'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');
const get = require('lodash/get');
const createError = require('http-errors');
module.exports = function(MaterialUse) {
  MaterialUse.nmsDetailElectric = async function(filter, res = null) {
    try {
      let { order, limit } = filter;
      if (!order || !limit) {
        res.header('content-range', 0);
        return [];
      }
      let { dmaId, timeRange, waterParameter, loggerId, flgSub } = filter.where;
      if (flgSub) {
        let logger = await MaterialUse.findById(loggerId);
        if (logger) {
          dmaId = logger.dmaId;
        }
      }
      if (!dmaId || !timeRange || !waterParameter || !loggerId) {
        res.header('content-range', 0);
        return [];
      }
      let { type, from, to } = timeRange;
      if (!type || !from || !to) {
        res.header('content-range', 0);
        return [];
      }

      let dataCollect = [];

      let timeFrom = moment(from)
        .startOf(type === 'hour' ? 'day' : type)
        .toDate();
      let timeTo = moment(to)
        .endOf(type === 'hour' ? 'day' : type)
        .toDate();

      let ids = [];
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

      // alertParam = 1: canh bao cho chat luong
      let alertThreshold = await MaterialUse.app.models.NmsAlertThreshold.findOne({
        where: { and: [{ waterParameter }, { alertParam: '1' }] },
      });

      if (!alertThreshold) {
        throw createError(400, 'error.ALERT_THRESHOLD_IS_MISS');
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
      ];

      let dmas = await aggregate(MaterialUse.app.models.Dma, queryLogger);
      let dataLoggerIds = [];
      for (let i = 0; i < dmas.length; i++) {
        let loggers = dmas[i].loggers;
        for (let k = 0; k < loggers.length; k++) {
          dataLoggerIds.push(loggers[k]._id);
        }
      }
      let query = [
        {
          $match: {
            $and: [
              { dataLoggerId: { $in: dataLoggerIds } },
              { [waterParameter]: { $exists: true } },
              { logTime: { $gt: timeFrom, $lt: timeTo } },
            ],
          },
        },
      ];
      //so với giá trị threshold trong bảng alertthreshold cho field report: rất cao: 1, cao: 2, thấp: 3, rất thấp: 4, bình thường: 5
      let avgValue = '$' + waterParameter;
      let alertQuery = {
        high: {
          $project: {
            id: '$_id',
            [waterParameter]: 1,
            name: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            alert: {
              $cond: {
                if: { $gte: [avgValue, 10] },
                then: 1,
                else: {
                  $cond: {
                    if: { $gte: [avgValue, 8] },
                    then: 2,
                    else: 5,
                  },
                },
              },
            },
          },
        },
        low: {
          $project: {
            id: '$_id',
            [waterParameter]: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            alert: {
              $cond: {
                if: { $lte: [avgValue, 0] },
                then: 4,
                else: {
                  $cond: {
                    if: { $lte: [avgValue, 0] },
                    then: 3,
                    else: 5,
                  },
                },
              },
            },
          },
        },
        highAndLow: {
          $project: {
            id: '$_id',
            [waterParameter]: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            alert: {
              $cond: {
                if: { $gte: [avgValue, 0] },
                then: 1,
                else: {
                  $cond: {
                    if: { $gte: [avgValue, 0] },
                    then: 2,
                    else: {
                      $cond: {
                        if: { $lte: [avgValue, 0] },
                        then: 4,
                        else: {
                          $cond: {
                            if: { $lte: [avgValue, 0] },
                            then: 3,
                            else: 5,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      let NmsLogRawQuality = MaterialUse.app.models.NmsLogRawQuality;
      for (let i = 0; i < dmas.length; i++) {
        let tempData = [];
        let dmaName = dmas[i].name;
        let alertItem = alertThreshold; //alertThreshold.filter(item => item.dmaId.equals(dmaId))[0];
        //check nếu k có item threshold thì lấy item default [0]
        // if (alertItem == 'undefined' || !alertItem) {
        //   alertItem = alertThreshold[0];
        // }

        // alertType: loai canh bao
        // 1: canh bao cao
        // 2: canh bao thap
        // 3: canh bao cao va thap
        switch (get(alertItem, 'alertType')) {
          case '1':
            alertQuery.high.$project.dmaName = dmaName;
            alertQuery.high.$project.alert.$cond.if = { $gte: [avgValue, alertItem.alertCriticalHigh] };
            alertQuery.high.$project.alert.$cond.else.$cond.if = { $gte: [avgValue, alertItem.alertHigh] };
            query.push(alertQuery.high);
            tempData = await aggregate(NmsLogRawQuality, query);
            break;
          case '2':
            alertQuery.low.$project.dmaName = dmaName;
            alertQuery.low.$project.alert.$cond.if = { $lte: [avgValue, alertItem.alertCriticalLow] };
            alertQuery.low.$project.alert.$cond.else.$cond.if = { $lte: [avgValue, alertItem.alertLow] };
            query.push(alertQuery.low);
            tempData = await aggregate(NmsLogRawQuality, query);
            break;
          case '3':
            alertQuery.highAndLow.$project.dmaName = dmaName;
            alertQuery.highAndLow.$project.alert.$cond.if = { $gte: [avgValue, alertItem.alertCriticalHigh] };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.if = { $gte: [avgValue, alertItem.alertHigh] };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.if = {
              $lte: [avgValue, alertItem.alertCriticalLow],
            };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.else.$cond.if = {
              $lte: [avgValue, alertItem.alertLow],
            };
            query.push(alertQuery.highAndLow);
            tempData = await aggregate(NmsLogRawQuality, query);
            break;
          default:
            break;
        }
        dataCollect.push(...tempData);
      }

      // if (filter.fetchAll) {
      //   filter.limit = dataCollect.length;
      //   filter.skip = 0;
      // }
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };

  MaterialUse.remoteMethod('nmsDetailElectric', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
