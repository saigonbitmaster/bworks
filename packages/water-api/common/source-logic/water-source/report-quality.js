'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');
const get = require('lodash/get');

module.exports = function(WaterSource) {
  WaterSource.reportQuality = async function(filter, res = null) {
    try {
      let { order, limit } = filter;
      if (!order || !limit) {
        res.header('content-range', 0);
        return [];
      }
      let { selectedWaterSources, selectedWaterParam, typeTime, valueTimeFrom, valueTimeTo } = filter.where;
      let dataCollect = [];
      if (
        typeof selectedWaterSources == 'undefined' ||
        selectedWaterSources.length <= 0 ||
        selectedWaterParam == 'undefined' ||
        selectedWaterParam.id == 'null' ||
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

      let waterParameterName = await WaterSource.app.models.WaterParameter.findOne({
        where: { id: selectedWaterParam.id },
        fields: { name: true, symbol: true },
      });
      let paramSymbol = waterParameterName.symbol.toLowerCase();
      let waterParameterId = new ObjectID(selectedWaterParam.id);
      let ids = selectedWaterSources.map(item => new ObjectID(item.id));
      let alertThreshold = await WaterSource.app.models.AlertThreshold.find({
        where: { and: [{ waterParameterId: waterParameterId }, { alertParam: '1' }] },
      });
      let queryDataLogger = [
        { $match: { _id: { $in: ids } } },
        { $project: { _id: 1, name: 1 } },
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
      let dataLoggerIds = waterSourceToDataLogger.map(item => item.dataLoggers._id);
      //Item {paramSymbol: { $exists: true }} trong first stage $match cần đc thêm trong for do nó là key
      let query = [
        {
          $match: {
            $and: [
              { dataLoggerId: { $in: dataLoggerIds } },
              { [paramSymbol]: { $exists: true } },
              { logTime: { $gt: timeFrom, $lt: timeTo } },
            ],
          },
        },
      ];
      //so với giá trị threshold trong bảng alertthreshold cho field report: rất cao: 1, cao: 2, thấp: 3, rất thấp: 4, bình thường: 5

      let avgValue = '$' + paramSymbol;
      let alertQuery = {
        high: {
          $project: {
            id: '$_id',
            [paramSymbol]: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            waterParameterName: waterParameterName.name,
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
            [paramSymbol]: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            waterParameterName: waterParameterName.name,
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
            [paramSymbol]: 1,
            dataLoggerId: 1,
            waterParameter: 1,
            logTime: 1,
            waterParameterName: waterParameterName.name,
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

      let RawWaterSourceVolume = WaterSource.app.models.RawWaterSourceVolume;
      for (let i = 0; i < waterSourceToDataLogger.length; i++) {
        let tempData = [];
        let waterSourceId = waterSourceToDataLogger[i]._id;
        let waterSourceName = waterSourceToDataLogger[i].name;
        //Mỗi nguồn chỉ có một cảnh báo cho từng thông số. do vậy lấy item đầu tiên
        let alertItem = alertThreshold.filter(item => item.waterSourceId.equals(waterSourceId))[0];
        //check nếu k có item threshold thì lấy item default [0]
        if (alertItem == 'undefined' || !alertItem) {
          alertItem = alertThreshold[0];
        }

        switch (get(alertItem, 'alertType')) {
          case '1':
            alertQuery.high.$project.waterSourceName = waterSourceName;
            alertQuery.high.$project.alert.$cond.if = { $gte: [avgValue, alertItem.alertCriticalHigh] };
            alertQuery.high.$project.alert.$cond.else.$cond.if = { $gte: [avgValue, alertItem.alertHigh] };
            query.push(alertQuery.high);
            tempData = await aggregate(RawWaterSourceVolume, query);
            break;
          case '2':
            alertQuery.low.$project.waterSourceName = waterSourceName;
            alertQuery.low.$project.alert.$cond.if = { $lte: [avgValue, alertItem.alertCriticalLow] };
            alertQuery.low.$project.alert.$cond.else.$cond.if = { $lte: [avgValue, alertItem.alertLow] };
            query.push(alertQuery.low);
            tempData = await aggregate(RawWaterSourceVolume, query);
            break;
          case '3':
            alertQuery.highAndLow.$project.waterSourceName = waterSourceName;
            alertQuery.highAndLow.$project.alert.$cond.if = { $gte: [avgValue, alertItem.alertCriticalHigh] };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.if = { $gte: [avgValue, alertItem.alertHigh] };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.if = {
              $lte: [avgValue, alertItem.alertCriticalLow],
            };
            alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.else.$cond.if = {
              $lte: [avgValue, alertItem.alertLow],
            };
            query.push(alertQuery.highAndLow);
            tempData = await aggregate(RawWaterSourceVolume, query);
            break;
          default:
            break;
        }
        dataCollect.push(...tempData);
      }

      if (filter.fetchAll) {
        filter.limit = dataCollect.length;
        filter.skip = 0;
      }
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };

  WaterSource.remoteMethod('reportQuality', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};

/*

'use strict';
const moment = require('moment');
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');
const ObjectID = require('mongodb').ObjectID;


module.exports = function(WaterSource) {

    WaterSource.reportQuality = async function(filter, res) {
        try {

            let {selectedWaterSources, selectedWaterParam, typeTime, valueTimeFrom, valueTimeTo, ...rest} = filter.where;
            let dataCollect = [];
            if (typeof  selectedWaterSources == 'undefined' ||
                selectedWaterSources.length <= 0 ||
                selectedWaterParam == 'undefined' ||
                typeof typeTime == 'undefined'
            ) {
                return utilCommon.filterData(filter, dataCollect, res);
            };

            let timeFrom = null, timeTo = null;
            switch (typeTime) {
                case 'hour':
                    timeFrom = moment(valueTimeFrom).startOf('day').toDate();
                    timeTo = moment(valueTimeTo).endOf('day').toDate();
                    break;
                case 'day':
                    timeFrom = moment(valueTimeFrom).startOf('day').toDate();
                    timeTo = moment(valueTimeTo).endOf('day').toDate();
                    break;
                case 'month':
                    timeFrom = moment(valueTimeFrom).startOf('month').toDate();
                    timeTo = moment(valueTimeTo).endOf('month').toDate();
                    break;
                case 'year':
                    timeFrom = moment().year(valueTimeFrom).startOf('year').toDate();
                    timeTo = moment().year(valueTimeTo).endOf('year').toDate();
                    break;
                default:
                    break;
            };

            let waterParameterName = await WaterSource.app.models.WaterParameter.findOne({
                where: {id: selectedWaterParam.id},
                fields: {name: true}
            });

            let waterParameterId = new ObjectID(selectedWaterParam.id);
            let ids = selectedWaterSources.map(item => new ObjectID(item.id));
            let alertThreshold = await WaterSource.app.models.AlertThreshold.find({where: {and: [{waterParameterId: waterParameterId}, {alertParam: '1'}, {waterSourceId: {inq: ids}}]}});
            let queryDataLogger = [
                {$match: {_id: {$in: ids}}},
                {$project: {id: 1, name: 1}},
                {$lookup: {
                    from: 'DataLogger',
                    localField: '_id',
                    foreignField: 'waterSourceId',
                    as: 'dataLoggers'
                }},
                {$unwind: '$dataLoggers'}
            ];

            let waterSourceToDataLogger =  await aggregate(WaterSource, queryDataLogger);
            let dataLoggerIds = waterSourceToDataLogger.map(item => item.dataLoggers._id)
            let query = [
                {
                    $match: {
                        $and: [
                            {dataLoggerId: {$in: dataLoggerIds}},
                            {waterParameter: waterParameterId},
                            {logTime: {$gt: timeFrom, $lt: timeTo}}]
                    }
                }
            ];
            //so với giá trị threshold trong bảng alertthreshold cho field report: rất cao: 1, cao: 2, thấp: 3, rất thấp: 4, bình thường: 5
            let avgValue = "$" + "avgValue";
            let alertQuery = {
                high: {
                    $project: {
                        id: 1,
                        avgValue: 1,
                        dataLoggerId: 1,
                        waterParameter: 1,
                        logTime: 1,
                        waterParameterName: waterParameterName.name,
                        alert: {
                            $cond: {
                                if: {$gte: [avgValue, 10]},
                                then: 1,
                                else: {
                                    $cond: {
                                        if: {$gte: [avgValue, 8]},
                                        then: 2,
                                        else: 5
                                    }
                                }
                            }
                        }
                    }
                },
                low: {
                    $project: {
                        id: 1,
                        avgValue: 1,
                        dataLoggerId: 1,
                        waterParameter: 1,
                        logTime: 1,
                        waterParameterName: waterParameterName.name,
                        alert: {
                            $cond: {
                                if: {$lte: [avgValue, 0]},
                                then: 4,
                                else: {
                                    $cond: {
                                        if: {$lte: [avgValue, 0]},
                                        then: 3,
                                        else: 5
                                    }
                                }
                            }
                        }
                    }
                },
                highAndLow: {
                    $project: {
                        id: 1,
                        avgValue: 1,
                        dataLoggerId: 1,
                        waterParameter: 1,
                        logTime: 1,
                        waterParameterName: waterParameterName.name,
                        alert: {
                            $cond: {
                                if: {$gte: [avgValue, 0]},
                                then: 1,
                                else: {
                                    $cond: {
                                        if: {$gte: [avgValue, 0]},
                                        then: 2,
                                        else: {
                                            $cond: {
                                                if: {$lte: [avgValue, 0]},
                                                then: 4,
                                                else: {
                                                    $cond: {
                                                        if: {$lte: [avgValue, 0]},
                                                        then: 3,
                                                        else: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };


            let RawWaterSourceVolume = WaterSource.app.models.RawWaterSourceVolume;
            for (let i = 0; i < waterSourceToDataLogger.length; i ++ ) {
                let tempData = [];
                let waterSourceId = waterSourceToDataLogger[i]._id;
                let waterSourceName = waterSourceToDataLogger[i].name;
                //Mỗi nguồn chỉ có một cảnh báo cho từng thông số. do vậy lấy item đầu tiên
                let alertItem =  alertThreshold.filter(item => item.waterSourceId.equals(waterSourceId))[0];
                //check nếu k có item threshold thì lấy item default [0]
                if (alertItem == 'undefined' || !alertItem) {
                    alertItem =  alertThreshold[0];
                }

                switch (alertItem.alertType) {
                    case '1':
                        alertQuery.high.$project.waterSourceName = waterSourceName;
                        alertQuery.high.$project.alert.$cond.if = {$gte: [avgValue, alertItem.alertCriticalHigh]};
                        alertQuery.high.$project.alert.$cond.else.$cond.if = {$gte: [avgValue, alertItem.alertHigh]};
                        query.push(alertQuery.high);
                        tempData = await aggregate(RawWaterSourceVolume, query);
                        break;
                    case '2':
                        alertQuery.low.$project.waterSourceName = waterSourceName;
                        alertQuery.low.$project.alert.$cond.if = {$lte: [avgValue, alertItem.alertCriticalLow]};
                        alertQuery.low.$project.alert.$cond.else.$cond.if = {$lte: [avgValue, alertItem.alertLow]};
                        query.push(alertQuery.low);
                        tempData = await aggregate(RawWaterSourceVolume, query);
                        break;
                    case '3':
                        alertQuery.highAndLow.$project.waterSourceName = waterSourceName;
                        alertQuery.highAndLow.$project.alert.$cond.if = {$gte: [avgValue, alertItem.alertCriticalHigh]};
                        alertQuery.highAndLow.$project.alert.$cond.else.$cond.if = {$gte: [avgValue, alertItem.alertHigh]};
                        alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.if = {$lte: [avgValue, alertItem.alertCriticalLow]};
                        alertQuery.highAndLow.$project.alert.$cond.else.$cond.else.$cond.else.$cond.if = {$lte: [avgValue, alertItem.alertLow]}
                        query.push(alertQuery.highAndLow);
                        tempData = await aggregate(RawWaterSourceVolume, query);
                        break;
                    default:
                        break;
                };
                dataCollect.push(...tempData);
            };

            return utilCommon.filterData(filter, dataCollect, res);
        } catch (e) {
            throw e;
        }
    };

    WaterSource.remoteMethod('reportQuality', {
        accepts: [{ arg: 'filter', type: 'object' }, { arg: 'res', type: 'object', http: { source: 'res' } }],
        http: { verb: 'get' },
        returns: { arg: 'data', type: 'object', root: true },
    });
};
*/
