'use strict';
const moment = require('moment');
const aggregate = require('../../utils/aggregate');

const waterSourceUtil = require('../../utils/check-alert');

module.exports = function(WaterSource) {
  async function currentDataLoggerData(
    queryTemplate,
    RawWaterSourceToDataLogger,
    waterSourceToDataLogger,
    RawWaterSourceVolume,
    recordPH,
    recordNTU,
  ) {
    let tempData1 = [],
      dataWithAlert = [];

    for (let i = 0; i < waterSourceToDataLogger.length; i++) {
      let tempData = [];
      let query = [];
      queryTemplate.dataLoggerMatch.$match.dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
      query.push(queryTemplate.dataLoggerMatch);
      query.push(queryTemplate.dataLoggerSort);
      query.push(queryTemplate.dataLoggerLimit);
      query.push(queryTemplate.dataLoggerStatus);
      tempData = await aggregate(RawWaterSourceVolume, query);

      let tmp = [];
      tmp = tempData;
      let dataPH = {};
      let dataNTU = {};
      if (recordPH && tmp.length === 1) {
        dataPH = await WaterSource.app.models.WaterQualityHourly.findOne({
          where: {
            and: [{ dataLoggerId: waterSourceToDataLogger[i].dataLoggers._id }, { waterParameterId: recordPH.id }],
          },
          order: 'logTime DESC',
        });
        if (dataPH) {
          tmp[0].ph = dataPH.rawData['11'].value;
        }
      }

      if (recordNTU && tmp.length === 1) {
        dataNTU = await WaterSource.app.models.WaterQualityHourly.findOne({
          where: {
            and: [{ dataLoggerId: waterSourceToDataLogger[i].dataLoggers._id }, { waterParameterId: recordNTU.id }],
          },
          order: 'logTime DESC',
        });
        if (dataNTU) {
          tmp[0].ntu = dataNTU.rawData['11'].value;
        }
      }

      tempData1 = [...tempData1, ...tmp];
    }
    let alertThresholds = await WaterSource.app.models.AlertThreshold.find();
    let waterParameters = await WaterSource.app.models.WaterParameter.find({ fields: { id: true, symbol: true } });
    dataWithAlert = tempData1.map(item =>
      waterSourceUtil.countAlert(item, alertThresholds, waterParameters, waterSourceToDataLogger),
    );
    //  console.log(JSON.stringify(dataWithAlert));
    //format dataLoggerData to: [{waterSourceId, [loggerStatus]}]
    return RawWaterSourceToDataLogger.map(item => {
      let newItem = {};
      newItem.waterSourceName = item.name;
      newItem.waterSourceId = item._id;
      newItem.dataLoggers = [];
      item.dataLoggers.forEach(item1 => {
        if (dataWithAlert.filter(item2 => item2.dataLoggerId.equals(item1._id)).length > 0) {
          let itemData = dataWithAlert.filter(item2 => item2.dataLoggerId.equals(item1._id))[0];
          itemData.dataLoggerName = item1.name;
          newItem.dataLoggers.push(itemData);
        }
      });
      return newItem;
    });
  }

  WaterSource.dashboard = async function(mode) {
    try {
      let dataCollect = [],
        widgetData = [];
      let timeFromDay, timeToDay, timeToMonth, timeFromYear, timeToYear, timeToAlarm, timeToCritical;
      timeFromDay = moment()
        .startOf('day')
        .toDate();
      timeToDay = moment()
        .endOf('day')
        .toDate();
      // timeFromMonth = moment()
      //   .subtract(1, 'months')
      //   .startOf('month')
      //   .toDate();
      timeToMonth = moment()
        .subtract(1, 'months')
        .endOf('month')
        .toDate();
      timeFromYear = moment()
        .startOf('year')
        .toDate();
      timeToYear = moment().toDate();
      //trễ 2hours -> cảnh báo critical = 1, trễ 1 hour cảnh báo alarm = 2, < 1 hour -> normal = 3
      timeToAlarm = moment()
        .subtract(1, 'hours')
        .startOf('hour')
        .toDate();
      timeToCritical = moment()
        .subtract(2, 'hours')
        .startOf('hour')
        .toDate();
      let timeObj = {
        timeDay: {
          typeTime: 'day',
          timeFrom: timeFromDay,
          timeTo: timeToDay,
        },
        timeMonth: {
          typeTime: 'month',
          timeFrom: timeToMonth,
          timeTo: timeToMonth,
        },
        timeYear: {
          typeTime: 'year',
          timeFrom: timeFromYear,
          timeTo: timeToYear,
        },
      };

      let factories = await WaterSource.app.models.Factory.find({
        fields: { id: true, dailyCapacity: true, monthlyCapacity: true, yearlyCapacity: true },
      });

      let queryDataLogger = {
        project: {
          $project: {
            _id: 1,
            name: 1,
            dailyCapacity: 1,
            monthlyCapacity: 1,
            yearCapacity: 1,
            sourceStatus: 1,
            isBackupSource: 1,
          },
        },
        lookup: {
          $lookup: {
            from: 'DataLogger',
            localField: '_id',
            foreignField: 'waterSourceId',
            as: 'dataLoggers',
          },
        },
        unwind: { $unwind: '$dataLoggers' },
      };

      let a = [];
      a.push(queryDataLogger.project, queryDataLogger.lookup);
      let rawWaterSourceToDataLogger = await aggregate(WaterSource, a);
      a.push(queryDataLogger.unwind);
      let waterSourceToDataLogger = await aggregate(WaterSource, a);
      // let dataLoggerIds = waterSourceToDataLogger.map(item => item.dataLoggers._id);
      //data logger latest signal: 1: critical, 2 alert, 3: normal
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
            sumWaterUsage: {
              $sum: '$waterUsage',
            },
          },
        },
        dataLoggerLatest: {
          $group: {
            _id: '$dataLoggerId',
            lastLogTime: {
              $max: '$logTime',
            },
          },
        },

        dataLoggerMatch: { $match: { dataLoggerId: null } },
        dataLoggerSort: { $sort: { logTime: -1 } },
        dataLoggerLimit: { $limit: 1 },
        dataLoggerStatus: {
          $project: {
            _id: 1,
            volume: 1,
            ntu: 1,
            ph: 1,
            logTime: 1,
            flowRate: 1,
            waterSourceId: 1,
            dataLoggerId: 1,
            alert: {
              $cond: {
                if: { $lte: ['$logTime', timeToCritical] },
                then: 1,
                else: {
                  $cond: {
                    if: { $lte: ['$logTime', timeToAlarm] },
                    then: 2,
                    else: 5,
                  },
                },
              },
            },
          },
        },
      };
      //query data for widgets

      let recordPH = await WaterSource.app.models.WaterParameter.findOne({
        where: { symbol: 'PH' },
        fields: { id: true, symbol: true },
      });

      // do duc
      let recordNTU = await WaterSource.app.models.WaterParameter.findOne({
        where: { symbol: 'NTU' },
        fields: { id: true, symbol: true },
      });

      //query data for map icon and latest status: 1: critical, 2: alarm, 3: normal
      let RawWaterSourceVolume = WaterSource.app.models.RawWaterSourceVolume;
      switch (mode) {
        case 'widget': {
          let todayVolume = [],
            lastMonthVolume = [],
            thisYearVolume = [];
          for (let i = 0; i < waterSourceToDataLogger.length; i++) {
            let tempData = [];
            let query = [];
            queryTemplate.match.$match.$and[0].dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
            queryTemplate.match.$match.$and[1].logTime.$gte = timeObj.timeDay.timeFrom;
            queryTemplate.match.$match.$and[1].logTime.$lte = timeObj.timeDay.timeTo;
            query.push(queryTemplate.match);
            query.push(queryTemplate.group);
            query.push(queryTemplate.project);
            query.push(queryTemplate.finalProject);
            tempData = await aggregate(RawWaterSourceVolume, query);
            todayVolume.push(...tempData.map(item => item.sumWaterUsage));
          }
          for (let i = 0; i < waterSourceToDataLogger.length; i++) {
            let tempData = [];
            let query = [];
            queryTemplate.match.$match.$and[0].dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
            queryTemplate.match.$match.$and[1].logTime.$gte = timeObj.timeMonth.timeFrom;
            queryTemplate.match.$match.$and[1].logTime.$lte = timeObj.timeMonth.timeTo;
            query.push(queryTemplate.match);
            query.push(queryTemplate.group);
            query.push(queryTemplate.project);
            query.push(queryTemplate.finalProject);
            tempData = await aggregate(RawWaterSourceVolume, query);
            lastMonthVolume.push(...tempData.map(item => item.sumWaterUsage));
          }
          for (let i = 0; i < waterSourceToDataLogger.length; i++) {
            let tempData = [];
            let query = [];
            queryTemplate.match.$match.$and[0].dataLoggerId = waterSourceToDataLogger[i].dataLoggers._id;
            queryTemplate.match.$match.$and[1].logTime.$gte = timeObj.timeYear.timeFrom;
            queryTemplate.match.$match.$and[1].logTime.$lte = timeObj.timeYear.timeTo;
            query.push(queryTemplate.match);
            query.push(queryTemplate.group);
            query.push(queryTemplate.project);
            query.push(queryTemplate.finalProject);
            tempData = await aggregate(RawWaterSourceVolume, query);
            thisYearVolume.push(...tempData.map(item => item.sumWaterUsage));
          }

          //volume
          let todayValue = todayVolume.reduce((a, b) => a + b, 0);
          let lastMonthValue = lastMonthVolume.reduce((a, b) => a + b, 0);
          let thisYearValue = thisYearVolume.reduce((a, b) => a + b, 0);
          //source info

          let totalDailyCapacity = rawWaterSourceToDataLogger
            .map(item => item.dailyCapacity)
            .reduce((a, b) => a + b, 0);
          let totalMonthlyCapacity = rawWaterSourceToDataLogger
            .map(item => item.monthlyCapacity)
            .reduce((a, b) => a + b, 0);
          let totalYearlyCapacity = rawWaterSourceToDataLogger
            .map(item => item.yearCapacity)
            .reduce((a, b) => a + b, 0);
          let totalBackupSource = rawWaterSourceToDataLogger.filter(item => item.isBackupSource == true).length;
          let totalInOperationSource = rawWaterSourceToDataLogger.filter(item => item.sourceStatus == '1').length;
          let totalInMaintainSource = rawWaterSourceToDataLogger.filter(item => item.sourceStatus == '2').length;
          let totalFactory = factories.map(item => item.dailyCapacity).length;
          //factory info
          let totalDailyCapacityFactory = factories.map(item => item.dailyCapacity).reduce((a, b) => a + b, 0);
          let totalMonthlyCapacityFactory = factories.map(item => item.monthlyCapacity).reduce((a, b) => a + b, 0);
          let totalYearlyCapacityFactory = factories.map(item => item.yearlyCapacity).reduce((a, b) => a + b, 0);
          //push data to response
          widgetData.push({ id: 'waterSourceCount', value: rawWaterSourceToDataLogger.length || 0 });
          widgetData.push({ id: 'today', value: todayValue });
          widgetData.push({ id: 'lastMonth', value: lastMonthValue });
          widgetData.push({ id: 'thisYear', value: thisYearValue });
          widgetData.push({ id: 'totalDailyCapacity', value: totalDailyCapacity });
          widgetData.push({ id: 'totalMonthlyCapacity', value: totalMonthlyCapacity });
          widgetData.push({ id: 'totalYearlyCapacity', value: totalYearlyCapacity });
          widgetData.push({ id: 'totalBackupSource', value: totalBackupSource });
          widgetData.push({ id: 'totalInOperationSource', value: totalInOperationSource });
          widgetData.push({ id: 'totalInMaintainSource', value: totalInMaintainSource });
          widgetData.push({ id: 'totalFactory', value: totalFactory });
          widgetData.push({ id: 'totalDailyCapacityFactory', value: totalDailyCapacityFactory });
          //push tem totalCurrentDailyVolumeFactory = 200000 to test first
          widgetData.push({ id: 'totalCurrentDailyVolumeFactory', value: 200000 });
          widgetData.push({ id: 'totalMonthlyCapacityFactory', value: totalMonthlyCapacityFactory });
          widgetData.push({ id: 'totalYearlyCapacityFactory', value: totalYearlyCapacityFactory });
          dataCollect = [...widgetData];
          break;
        }
        case 'dataLogger':
          dataCollect = await currentDataLoggerData(
            queryTemplate,
            rawWaterSourceToDataLogger,
            waterSourceToDataLogger,
            RawWaterSourceVolume,
            recordPH,
            recordNTU,
          );
          break;
        case 'notify': {
          let a = await currentDataLoggerData(
            queryTemplate,
            rawWaterSourceToDataLogger,
            waterSourceToDataLogger,
            RawWaterSourceVolume,
            recordPH,
            recordNTU,
          );

          //arrays = arrays.reduce((a, b) => a.concat(b), []);
          let b = a.filter(item => item.dataLoggers.length > 0).map(item => item.dataLoggers);
          let c = b.reduce((a, b) => a.concat(b), []);
          dataCollect = c.map(item => {
            if (item.alert !== 5) {
              item.alertRecord.totalAlert.push({ param: 'logTime', alert: item.alert });
            }
            return item;
          });

          break;
        }

        case 'waterSource': {
          let rawWaterSourceData = await currentDataLoggerData(
            queryTemplate,
            rawWaterSourceToDataLogger,
            waterSourceToDataLogger,
            RawWaterSourceVolume,
            recordPH,
            recordNTU,
          );
          let waterSourceData = rawWaterSourceData.map(item => {
            let newItem = {};
            newItem.totalFlowRate = item.dataLoggers.map(item1 => item1.flowRate).reduce((a, b) => a + b, 0);
            newItem.waterSourceName = item.waterSourceName;
            newItem.waterSourceId = item.waterSourceId;
            let itemDate = item.dataLoggers.map(item1 => item1.logTime);
            let itemAlert = item.dataLoggers.map(item1 => item1.alert);
            let itemPh = item.dataLoggers.map(item1 => item1.ph);
            let itemNtu = item.dataLoggers.map(item1 => item1.ntu);
            let itemAlerts = item.dataLoggers.map(item1 => item1.alertRecord.totalAlert.length);
            let itemTotalCriticals = item.dataLoggers.map(item1 => item1.alertRecord.totalCritical.length);

            if (itemTotalCriticals.length > 0) {
              newItem.totalCritical = itemTotalCriticals.reduce((a, b) => a + b, 0);
            }
            if (itemAlerts.length > 0) {
              newItem.totalAlert = itemAlerts.reduce((a, b) => a + b, 0);
            }
            if (itemAlert.length > 0) {
              newItem.alert = Math.min(...itemAlert);
            }
            if (itemDate.length > 0) {
              newItem.logTime = Math.max(...itemDate);
            }
            if (itemPh.length > 0) {
              newItem.avgPh = itemPh.reduce((a, b) => a + b, 0) / itemPh.length;
            }
            if (itemNtu.length > 0) {
              newItem.avgNtu = itemNtu.reduce((a, b) => a + b, 0) / itemNtu.length;
            }

            return newItem;
          });
          dataCollect = [...waterSourceData];
          break;
        }

        default:
          break;
      }

      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('dashboard', {
    accepts: [{ arg: 'mode', type: 'string', default: 'widget' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

//logic server tra ve rest
