const materialDetailType = require('../../testData/data/nms/010-test-material-detail-type');
const materialStock = require('../../testData/data/nms/020-test-material-stock');
const materialExport = require('../../testData/data/nms/030-test-material-export');
const dma = require('../../testData/data/nms/040-test-dma');
const { mapSeries } = require('async');
module.exports = async app => {
  if (process.env.NODE_INIT_DATA_SIMPLE_NMS) {
    console.log('start run init data simple nms');

    let queues = [materialDetailType, materialStock, materialExport, dma];

    await mapSeries(
      queues,
      async data => await data.init(app),
      err => (err ? console.error('Init data simple nms error', err) : console.log('Init data simple nms ok!')), // eslint-disable-line no-console
    );
  }
};
