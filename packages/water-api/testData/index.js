'use strict';
const { mapSeries } = require('async');

// const materialDetailType = require('./data/nms/010-test-material-detail-type');
// const materialStock = require('./data/nms/020-test-material-stock');
// const materialExport = require('./data/nms/030-test-material-export');

const materialDetailType = require('./data/nms/046-material-detail-type');
const materialStock = require('./data/nms/047-material-stock');
const materialExport = require('./data/nms/048-material-export');
const materialUse = require('./data/nms/049-material-use');

const dma = require('./data/nms/040-test-dma');
const waterMaintenance = require('./data/nms/041-water-maintenance');
const nmsAlertThreshold = require('./data/nms/042-nms-alert-threshold');
const node = require('./data/nms/043-node');
const task = require('./data/nms/044-task');
const kml = require('./data/nms/045-kml');
const icon = require('./data/nms/050-icon');
const packageConfig = require('./data/nms/051-package-config');
const pumpStation = require('./data/nms/052-pump-station');
const factory = require('./data/nms/053-factory');

module.exports = async app => {
  let queues = [icon, packageConfig]; // su dung trong db waterOrgMain
  let models = [
    'MaterialDetailType',
    'MaterialStock',
    'MaterialExport',
    'MaterialUse',
    'Dma',
    'WaterMaintenance',
    'NmsAlertThreshold',
    'Node',
    'Task',
    'Kml',
    // 'Icon',
    // 'PackageConfig',
    'PumpStation',
    'Factory',
  ];
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let item = await app.models[model].findOne({});
    if (item) {
      console.log('model exist data:', model);
    } else {
      switch (model) {
        case 'MaterialDetailType':
          queues.push(materialDetailType);
          break;
        case 'MaterialStock':
          queues.push(materialStock);
          break;
        case 'MaterialExport':
          queues.push(materialExport);
          break;
        case 'MaterialUse':
          queues.push(materialUse);
          break;
        case 'Dma':
          queues.push(dma);
          break;
        case 'WaterMaintenance':
          queues.push(waterMaintenance);
          break;
        case 'NmsAlertThreshold':
          queues.push(nmsAlertThreshold);
          break;
        case 'Node':
          queues.push(node);
          break;
        case 'Task':
          queues.push(task);
          break;
        case 'Kml':
          queues.push(kml);
          break;
        // case 'Icon':
        //   queues.push(icon);
        //   break;
        case 'PumpStation':
          queues.push(pumpStation);
          break;
        case 'Factory':
          queues.push(factory);
          break;
      }
    }
  }
  // init test data
  await mapSeries(
    queues,
    async data => await data.init(app),
    err => (err ? console.error('Init data nms error', err) : console.log('Init data nms ok!')), // eslint-disable-line no-console
  );
};
