'use strict';
const waterParameter = require('../../testData/data/wsrc/070-wsrc-water-parameter');
const factory = require('../../testData/data/wsrc/071-wsrc-factory');
const dataLogger = require('../../testData/data/wsrc/072-data-logger');
const meter = require('../../testData/data/wsrc/073-wsrc-meter');
const pipe = require('../../testData/data/wsrc/074-wsrc-pipe');
const pump = require('../../testData/data/wsrc/075-wsrc-pump');
const sensor = require('../../testData/data/wsrc/076-wsrc-sensor');
const waterSource = require('../../testData/data/wsrc/077-wsrc-water-source');
const waterSourceGroup = require('../../testData/data/wsrc/078-wsrc-water-source-group');
const waterStandard = require('../../testData/data/wsrc/079-wsrc-water-standard');
const sourceTemplate = require('../../testData/data/wsrc/080-wsrc-source-template');
const interfaceStandard = require('../../testData/data/wsrc/081-wsrc-interface-standard');
const alertThreshold = require('../../testData/data/wsrc/082-wsrc-alert-threshold');
const icon = require('../../testData/data/wsrc/083-wsrc-icon');
const { mapSeries } = require('async');
module.exports = async app => {
  if (process.env.NODE_INIT_DATA_WATER_SOURCE) {
    console.log('start run init data wsrc');
    let models = [
      'WaterParameter',
      'Factory',
      'DataLogger',
      'Meter',
      'Pipe',
      'Pump',
      'Sensor',
      'WaterSource',
      'WaterSourceGroup',
      'WaterStandard',
      'SourceTemplate',
      'InterfaceStandard',
      'AlertThreshold',
      // 'Icon',
    ];
    let queues = [icon]; // su dung trong db waterOrgMain
    for (let i = 0; i < models.length; i++) {
      let model = models[i];
      let item = await app.models[model].findOne({});
      if (item) {
        console.log('model exist data:', model);
      } else {
        switch (model) {
          case 'WaterParameter':
            queues.push(waterParameter);
            break;
          case 'Factory':
            queues.push(factory);
            break;
          case 'DataLogger':
            queues.push(dataLogger);
            break;
          case 'Meter':
            queues.push(meter);
            break;
          case 'Pipe':
            queues.push(pipe);
            break;
          case 'Pump':
            queues.push(pump);
            break;
          case 'Sensor':
            queues.push(sensor);
            break;
          case 'WaterSource':
            queues.push(waterSource);
            break;
          case 'WaterSourceGroup':
            queues.push(waterSourceGroup);
            break;
          case 'WaterStandard':
            queues.push(waterStandard);
            break;
          case 'SourceTemplate':
            queues.push(sourceTemplate);
            break;
          case 'InterfaceStandard':
            queues.push(interfaceStandard);
            break;
          case 'AlertThreshold':
            queues.push(alertThreshold);
            break;
          // case 'Icon':
          //   queues.push(icon);
          //   break;
        }
      }
    }
    // init test data
    await mapSeries(
      queues,
      async data => await data.init(app),
      err => (err ? console.error('Init data wsrc error', err) : console.log('Init data wsrc ok!')), // eslint-disable-line no-console
    );
  }
};
