'use strict';
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;
const utilCommon = require('../../utils/common');
const aggregate = require('../../utils/aggregate');

module.exports = function(WaterSource) {
  //Function thêm tên waterSource vào dữ liệu trước khi trả về. sau này nên include vào bảng dữ liệu sensor
  function addWaterSourceName(record, waterSourceToDataLogger, waterParameterName) {
    let tmpId = record._id;
    delete record._id;
    record.id = tmpId;
    let dataLoggerId = record.dataLoggerId;
    let waterSourceName = waterSourceToDataLogger.filter(item => item.dataLoggers._id.equals(dataLoggerId));
    return Object.assign(
      {},
      record,
      { waterSourceName: waterSourceName[0].name },
      { waterParameterName: waterParameterName.name },
    );
  }

  WaterSource.reportSummarizedQuality = async function(filter, res) {
    try {
      let { order, limit } = filter;
      if (!order || !limit) {
        res.header('content-range', 0);
        return [];
      }
      let { selectedWaterSources, selectedWaterParam, typeTime, valueTimeFrom, valueTimeTo } = filter.where;

      if (
        typeof selectedWaterSources == 'undefined' ||
        selectedWaterSources.length <= 0 ||
        selectedWaterParam == 'undefined' ||
        typeof typeTime == 'undefined'
      ) {
        return utilCommon.filterData(filter, [], res);
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

      let ids = [];
      ids = selectedWaterSources.map(item => new ObjectID(item.id));
      let waterParameterID = new ObjectID(selectedWaterParam);

      let waterParameterName = await WaterSource.app.models.WaterParameter.findOne({
        where: { id: waterParameterID },
        fields: { name: true },
      });

      let dataCollect = [];
      //Tạo list datalogger từ list watersource và tạo bảng map watersourceName-dataloggerID
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

      let dataLoggerIds = waterSourceToDataLogger.map(item => item.dataLoggers._id);

      //query dữ liệu sensor, tạm thời dùng bảng hourly trong srs-logs2
      let query = [
        {
          $match: {
            $and: [
              { dataLoggerId: { $in: dataLoggerIds } },
              { waterParameterId: waterParameterID },
              { logTime: { $gt: timeFrom, $lt: timeTo } },
            ],
          },
        },
      ];

      let WaterQualityHourly = WaterSource.app.models.WaterQualityHourly;
      let rawData = await aggregate(WaterQualityHourly, query);

      //Thêm field waterSourceName vào mỗi record dữ liệu trả về
      dataCollect = rawData.map(item => addWaterSourceName(item, waterSourceToDataLogger, waterParameterName));
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };
  WaterSource.remoteMethod('reportSummarizedQuality', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
