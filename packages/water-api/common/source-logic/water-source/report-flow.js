'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(WaterSource) {
  WaterSource.reportFlow = async function(filter, res) {
    try {
      let { order, limit } = filter;
      if (!order || !limit) {
        res.header('content-range', 0);
        return [];
      }
      let { selectedWaterSources, typeTime, valueTimeFrom, valueTimeTo } = filter.where;
      let dataCollect = [];
      if (
        typeof selectedWaterSources == 'undefined' ||
        selectedWaterSources.length <= 0 ||
        typeof typeTime == 'undefined'
      ) {
        return utilCommon.filterData(filter, dataCollect, res);
      }

      let timeFrom = null,
        timeTo = null;
      switch (typeTime) {
        case 'hour':
          timeFrom = moment(valueTimeFrom)
            .startOf('day')
            .toDate();
          timeTo = moment(valueTimeTo)
            .endOf('day')
            .toDate();
          break;
        case 'day':
          timeFrom = moment(valueTimeFrom)
            .startOf('day')
            .toDate();
          timeTo = moment(valueTimeTo)
            .endOf('day')
            .toDate();
          break;
        case 'month':
          timeFrom = moment(valueTimeFrom)
            .startOf('month')
            .toDate();
          timeTo = moment(valueTimeTo)
            .endOf('month')
            .toDate();
          break;
        case 'year':
          timeFrom = moment()
            .year(valueTimeFrom)
            .startOf('year')
            .toDate();
          timeTo = moment()
            .year(valueTimeTo)
            .endOf('year')
            .toDate();
          break;
        default:
          break;
      }

      let ids = selectedWaterSources.map(item => new ObjectID(item.id));
      let alertThreshold = await WaterSource.app.models.AlertThreshold.find({ where: { and: [{ alertParam: '2' }] } });

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
        { $unwind: '$dataLoggers' },
      ];

      let waterSourceToDataLogger = await aggregate(WaterSource, queryDataLogger);
      // let dataLoggerIds = waterSourceToDataLogger.map(item => item.dataLoggers._id);
      //make queryTemplate to filter flowRate and classify into: 1: criticalHigh, 2: high, 3: low, 4: criticalLow, 5: normal
      let queryTemplate = {
        match: {
          $match: {
            $and: [{ dataLoggerId: null }, { logTime: { $gt: timeFrom, $lt: timeTo } }],
          },
        },
        project: {
          $project: {
            id: '$_id',
            flowRate: 1,
            dataLoggerId: 1,
            waterSourceName: null,
            dataLoggerName: null,
            logTime: 1,
            alert: {
              $cond: {
                if: { $gte: ['$flowRate', 0] },
                then: 1,
                else: {
                  $cond: {
                    if: { $gte: ['$flowRate', 0] },
                    then: 2,
                    else: {
                      $cond: {
                        if: { $lte: ['$flowRate', 0] },
                        then: 4,
                        else: {
                          $cond: {
                            if: { $lte: ['$flowRate', 0] },
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

      let RawWaterSourceVolume = WaterSource.app.models.RawWaterSourceVolume;
      for (let i = 0; i < waterSourceToDataLogger.length; i++) {
        let tempData = [];
        let waterSourceId = waterSourceToDataLogger[i]._id;
        //get alertThreshold for this waterSource
        let alertItem = alertThreshold.filter(item => item.waterSourceId.equals(waterSourceId))[0];
        //if this waterSource have no threshold then use threshold from another watersource
        if (alertItem == 'undefined' || !alertItem) {
          alertItem = alertThreshold[0];
        }
        let query = [];
        //fill value to queryTemplate
        queryTemplate.match.$match.$and[0].dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
        queryTemplate.project.$project.waterSourceName = waterSourceToDataLogger[i].name;
        queryTemplate.project.$project.dataLoggerName = waterSourceToDataLogger[i].dataLoggers.name;
        queryTemplate.project.$project.alert.$cond.if = { $gte: ['$flowRate', alertItem.alertCriticalHigh] };
        queryTemplate.project.$project.alert.$cond.else.$cond.if = { $gte: ['$flowRate', alertItem.alertHigh] };
        queryTemplate.project.$project.alert.$cond.else.$cond.else.$cond.if = {
          $lte: ['$flowRate', alertItem.alertCriticalLow],
        };
        queryTemplate.project.$project.alert.$cond.else.$cond.else.$cond.else.$cond.if = {
          $lte: ['$flowRate', alertItem.alertLow],
        };
        //make real query
        query.push(queryTemplate.match);
        query.push(queryTemplate.project);
        tempData = await aggregate(RawWaterSourceVolume, query);
        dataCollect.push(...tempData);
      }
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('reportFlow', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
