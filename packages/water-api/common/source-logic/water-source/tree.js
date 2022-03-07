'use strict';
const sumBy = require('lodash/sumBy');
module.exports = function(WaterSource) {
  WaterSource.tree = async () => {
    let data = [];

    // ong
    let pipe = await WaterSource.app.models.Pipe.find({});
    let length = sumBy(pipe, 'length');
    data.push({
      _id: 'Pipe',
      type: 'Pipe',
      value: length,
    });

    // nha may
    let countFactory = await WaterSource.app.models.Factory.count();
    data.push({
      _id: 'Factory',
      type: 'Factory',
      value: countFactory,
    });

    // nguon nuoc
    let countWaterSource = await WaterSource.count();
    data.push({
      _id: 'WaterSource',
      type: 'WaterSource',
      value: countWaterSource,
    });

    // dong ho
    let countMeter = await WaterSource.app.models.Meter.count();
    data.push({
      _id: 'Meter',
      type: 'Meter',
      value: countMeter,
    });

    // cam bien
    let countSensor = await WaterSource.app.models.Sensor.count();
    data.push({
      _id: 'Sensor',
      type: 'Sensor',
      value: countSensor,
    });

    // may bom
    let countPump = await WaterSource.app.models.Pump.count();
    data.push({
      _id: 'Pump',
      type: 'Pump',
      value: countPump,
    });

    // thiet bi ghi/phat
    let countDataLogger = await WaterSource.app.models.DataLogger.count();
    data.push({
      _id: 'DataLogger',
      type: 'DataLogger',
      value: countDataLogger,
    });

    return data;
  };
  WaterSource.remoteMethod('tree', {
    accepts: [],
    returns: { root: true, type: ['object'] },
    http: { verb: 'get' },
  });
};
