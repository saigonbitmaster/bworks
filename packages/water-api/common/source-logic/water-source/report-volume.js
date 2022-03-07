'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(WaterSource) {
  WaterSource.reportVolume = async function(filter, res) {
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

      let ids = selectedWaterSources.map(item => new ObjectID(item.id));
      let alertThreshold = await WaterSource.app.models.AlertThreshold.find({ where: { and: [{ alertParam: '3' }] } });

      let queryDataLogger = [
        { $match: { _id: { $in: ids } } },
        { $project: { id: 1, name: 1, dailyCapacity: 1, monthCapacity: 1, yearCapacity: 1 } },
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
      // let capacityCatergory = null;

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

      let startTime = timeFrom;
      let timeSteps = [];
      while (startTime < timeTo) {
        let stopTime = moment(startTime)
          .add(1, typeTime)
          .toDate();
        timeSteps.push({ startTime: startTime, stopTime: stopTime });
        startTime = stopTime;
      }

      let queryTemplate = {
        match: {
          $match: {
            $and: [{ dataLoggerId: null }, { logTime: { $gte: null, $lte: null } }],
          },
        },
        group: {
          $group: {
            _id: null,
            minVolume: {
              $min: '$volume',
            },
            maxVolume: {
              $max: '$volume',
            },
          },
        },
        project: {
          $project: {
            waterUsage: {
              $subtract: ['$maxVolume', '$minVolume'],
            },
          },
        },
        finalProject: {
          $project: {
            dataLoggerName: null,
            waterSourceName: null,
            logTime: null,
            waterUsage: 1,
            id: null,
            alert: {
              $cond: {
                if: { $gte: ['$waterUsage', 0] },
                then: 1,
                else: {
                  $cond: {
                    if: { $gte: ['$waterUsage', 0] },
                    then: 2,
                    else: {
                      $cond: {
                        if: { $lte: ['$waterUsage', 0] },
                        then: 4,
                        else: {
                          $cond: {
                            if: { $lte: ['$waterUsage', 0] },
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
        let alertItem = alertThreshold.filter(item => item.waterSourceId.equals(waterSourceId))[0];
        //check nếu k có item threshold thì lấy item default [0]
        if (alertItem == 'undefined' || !alertItem) {
          alertItem = alertThreshold[0];
        }
        //chuyển alert từ % về giá trị thực m3 theo từng nguồn
        let capacityFactor = null,
          alertValue = {};
        switch (typeTime) {
          case 'hour':
            capacityFactor = waterSourceToDataLogger[i].dailyCapacity / 30;
            alertValue.alertCriticalHigh = capacityFactor * alertItem.alertCriticalHigh;
            alertValue.alertHigh = capacityFactor * alertItem.alertHigh;
            alertValue.alertLow = capacityFactor * alertItem.alertLow;
            alertValue.alertCriticalLow = capacityFactor * alertItem.alertCriticalLow;
            break;
          case 'day':
            capacityFactor = waterSourceToDataLogger[i].dailyCapacity;
            alertValue.alertCriticalHigh = capacityFactor * alertItem.alertCriticalHigh;
            alertValue.alertHigh = capacityFactor * alertItem.alertHigh;
            alertValue.alertLow = capacityFactor * alertItem.alertLow;
            alertValue.alertCriticalLow = capacityFactor * alertItem.alertCriticalLow;
            break;
          case 'month':
            capacityFactor = waterSourceToDataLogger[i].monthlyCapacity;
            alertValue.alertCriticalHigh = capacityFactor * alertItem.alertCriticalHigh;
            alertValue.alertHigh = capacityFactor * alertItem.alertHigh;
            alertValue.alertLow = capacityFactor * alertItem.alertLow;
            alertValue.alertCriticalLow = capacityFactor * alertItem.alertCriticalLow;
            break;
          case 'year':
            capacityFactor = waterSourceToDataLogger[i].yearCapacity;
            alertValue.alertCriticalHigh = capacityFactor * alertItem.alertCriticalHigh;
            alertValue.alertHigh = capacityFactor * alertItem.alertHigh;
            alertValue.alertLow = capacityFactor * alertItem.alertLow;
            alertValue.alertCriticalLow = capacityFactor * alertItem.alertCriticalLow;
            break;
          default:
            break;
        }

        queryTemplate.match.$match.$and[0].dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
        queryTemplate.finalProject.$project.dataLoggerName = waterSourceToDataLogger[i].dataLoggers.name;
        queryTemplate.finalProject.$project.waterSourceName = waterSourceToDataLogger[i].name;
        queryTemplate.finalProject.$project.alert.$cond.if = { $gte: ['$waterUsage', alertValue.alertCriticalHigh] };
        queryTemplate.finalProject.$project.alert.$cond.else.$cond.if = { $gte: ['$waterUsage', alertValue.alertHigh] };
        queryTemplate.finalProject.$project.alert.$cond.else.$cond.else.$cond.if = {
          $lte: ['$waterUsage', alertValue.alertCriticalLow],
        };
        queryTemplate.finalProject.$project.alert.$cond.else.$cond.else.$cond.else.$cond.if = {
          $lte: ['$waterUsage', alertValue.alertLow],
        };

        for (let j = 0; j < timeSteps.length; j++) {
          queryTemplate.match.$match.$and[1].logTime.$gte = timeSteps[j].startTime;
          queryTemplate.match.$match.$and[1].logTime.$lte = timeSteps[j].stopTime;
          queryTemplate.finalProject.$project.logTime = timeSteps[j].startTime;
          queryTemplate.finalProject.$project.id =
            timeSteps[j].startTime + waterSourceToDataLogger[i].dataLoggers._id + waterSourceToDataLogger[i].name;
          let query = [];
          query.push(queryTemplate.match);
          query.push(queryTemplate.group);
          query.push(queryTemplate.project);
          query.push(queryTemplate.finalProject);
          tempData = await aggregate(RawWaterSourceVolume, query);
          dataCollect.push(...tempData);
        }
      }
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('reportVolume', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
