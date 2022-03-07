'use strict';
// const moment = require('moment-timezone');
const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const materialDetailTypes = require('./010-test-material-detail-type').data;

const randomValue = (val = 0.8, range = 0.2) => {
  return val - range + parseFloat(Math.random() * range * 2);
};

module.exports = {
  init: async app => {
    let model = app.models.MaterialExport;
    await mapSeries(
      materialDetailTypes,
      async detailType => {
        let currentData = await model.findOne({ where: { detailTypeId: detailType.id } });
        let stockData = await app.models.MaterialStock.findOne({ where: { detailTypeId: detailType.id } });
        let random = parseInt(stockData.initValue * randomValue());
        if (stockData) {
          let data = {
            id: currentData ? currentData.id : undefined,
            name: detailType.name,
            type: detailType.type,
            stockId: stockData.id,
            exportValue: random,
            currentValue: random,
            detailTypeId: detailType.id,
          };
          return model.replaceOrCreate(dataUtil.defaultOperationData({ data, app }));
        }
        return true;
      }, // eslint-disable-next-line no-console
      err => (err ? console.error('Test data MaterialExport error', err) : console.log('Test data MaterialExport OK!')),
    );
  },
};
