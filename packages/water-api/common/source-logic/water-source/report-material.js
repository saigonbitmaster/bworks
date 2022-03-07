'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(WaterSource) {
  WaterSource.reportMaterial = async function(filter, res) {
    try {
      let { order, limit } = filter;
      if (!order || !limit) {
        res.header('content-range', 0);
        return [];
      }
      // eslint-disable-next-line
      let { selectedWaterSources, conditionType, selectConditions, selectMaterial, ...rest } = filter.where;
      //check if has filter for init
      if (
        typeof selectedWaterSources == 'undefined' ||
        selectedWaterSources.length <= 0 ||
        typeof conditionType == 'undefined' ||
        typeof selectConditions == 'undefined' ||
        !selectMaterial
      ) {
        return utilCommon.filterData(filter, [], res);
      }
      let ids = [];
      ids = selectedWaterSources.map(item => new ObjectID(item.id));
      let dataCollect = [];
      let expiredStandards = await WaterSource.app.models.SrcConfig.findById('StatisticMatLifeSpan');
      let expiredDate = moment()
        .subtract(expiredStandards.value.existTime.value, 'months')
        .toDate();
      let validDate = moment()
        .subtract(expiredStandards.value.lessTime.value, 'months')
        .toDate();
      //console.log(expiredStandards, expiredDate, validDate);
      /*logic lọc thời hạn
          setupDate + lessTime > hien tai (setupDate > validDate)        -> inValid
          setupDate + existTime < hien tai (setupDate < expiredDate)     -> expired
          expiredDate < setupDate < validDate                            -> nearExpired
          */

      let query = [
        { $match: { _id: { $in: ids } } },
        { $project: { _id: 1, name: 1 } },
        { $lookup: { from: selectMaterial, localField: '_id', foreignField: 'waterSourceId', as: 'results' } },
      ];

      // switch (selectMaterial) {
      //   case 'Meter':
      //     query.push();
      //     break;
      //   case 'Pump':
      //     query.push({ $lookup: { from: 'Pump', localField: '_id', foreignField: 'waterSourceId', as: 'results' } });
      //     break;
      //   case 'Sensor':
      //     query.push({ $lookup: { from: 'Sensor', localField: '_id', foreignField: 'waterSourceId', as: 'results' } });
      //     break;
      //   case 'DataLogger':
      //     query.push({
      //       $lookup: { from: 'DataLogger', localField: '_id', foreignField: 'waterSourceId', as: 'results' },
      //     });
      //     break;
      //   default:
      //     res.header('content-range', 0);
      //     return [];
      // }
      let rawData = await aggregate(WaterSource, query);

      switch (conditionType) {
        case '1':
          for (let i = 0; i < rawData.length; i++) {
            let rawRecord = rawData[i];
            for (let j = 1; j < 5; j++) {
              let record = {
                id: null,
                waterSource: null,
                materialStatus: null,
                // meter: 0,
                // sensor: 0,
                // dataLogger: 0,
                // pump: 0,
                totalDevice: 0,
              };
              record.id = i.toString() + j.toString();
              record.conditionType = '1';
              record.waterSource = rawRecord.name;
              record.materialStatus = j;
              // record.meter = rawRecord.meters.filter(item => item.materialStatus == j).length;
              // record.sensor = rawRecord.sensors.filter(item => item.materialStatus == j).length;
              // record.dataLogger = rawRecord.dataLoggers.filter(item => item.materialStatus == j).length;
              // record.pump = rawRecord.pumps.filter(item => item.materialStatus == j).length;
              // record.totalDevice = record.meter + record.sensor + record.dataLogger + record.pump;
              record.totalDevice = rawRecord.results.filter(item => item.materialStatus == j).length;
              dataCollect.push(record);
            }
          }
          break;
        case '2':
          for (let i = 0; i < rawData.length; i++) {
            let rawRecord = rawData[i];
            for (let j = 1; j < 4; j++) {
              let record = {
                id: null,
                waterSource: null,
                materialStatus: null,
                // meter: 0,
                // sensor: 0,
                // dataLogger: 0,
                // pump: 0,
                totalDevice: 0,
              };
              record.id = i.toString() + j.toString();
              record.conditionType = '2';
              record.waterSource = rawRecord.name;
              record.materialStatus = j;
              switch (j) {
                case 1:
                  // record.meter = rawRecord.meters.filter(item => item.setupDate < expiredDate).length;
                  // record.sensor = rawRecord.sensors.filter(item => item.setupDate < expiredDate).length;
                  // record.dataLogger = rawRecord.dataLoggers.filter(item => item.setupDate < expiredDate).length;
                  // record.pump = rawRecord.pumps.filter(item => item.setupDate < expiredDate).length;
                  // record.totalDevice = record.meter + record.sensor + record.dataLogger + record.pump;
                  record.totalDevice = rawRecord.results.filter(item => item.setupDate < expiredDate).length;
                  break;
                case 2:
                  // record.meter = rawRecord.meters.filter(
                  //   item => item.setupDate >= expiredDate && item.setupDate <= validDate,
                  // ).length;
                  // record.sensor = rawRecord.sensors.filter(
                  //   item => item.setupDate >= expiredDate && item.setupDate <= validDate,
                  // ).length;
                  // record.dataLogger = rawRecord.dataLoggers.filter(
                  //   item => item.setupDate >= expiredDate && item.setupDate <= validDate,
                  // ).length;
                  // record.pump = rawRecord.pumps.filter(
                  //   item => item.setupDate >= expiredDate && item.setupDate <= validDate,
                  // ).length;
                  // record.totalDevice = record.meter + record.sensor + record.dataLogger + record.pump;
                  record.totalDevice = rawRecord.results.filter(
                    item => item.setupDate >= expiredDate && item.setupDate <= validDate,
                  ).length;
                  break;
                case 3:
                  // record.meter = rawRecord.meters.filter(item => item.setupDate > validDate).length;
                  // record.sensor = rawRecord.sensors.filter(item => item.setupDate > validDate).length;
                  // record.dataLogger = rawRecord.dataLoggers.filter(item => item.setupDate > validDate).length;
                  // record.pump = rawRecord.pumps.filter(item => item.setupDate > validDate).length;
                  // record.totalDevice = record.meter + record.sensor + record.dataLogger + record.pump;
                  record.totalDevice = rawRecord.results.filter(item => item.setupDate > validDate).length;
                  break;
                default:
                  break;
              }
              dataCollect.push(record);
            }
          }
          break;
        default:
          break;
      }

      let filteredDataCollect = dataCollect.filter(
        item => selectConditions.indexOf(item.materialStatus.toString()) >= 0,
      );
      return utilCommon.filterData(filter, filteredDataCollect, res);
    } catch (e) {
      throw e;
    }
  };
  WaterSource.remoteMethod('reportMaterial', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
