'use strict';
const moment = require('moment-timezone');
const { mapSeries } = require('async');
const dataUtil = require('ra-loopback3/server/utils/data');
const materialDetailTypes = require('./010-test-material-detail-type').data;

const randomDom = (subtractMonth = 12) => {
  let result = moment()
    .subtract(subtractMonth, 'M') // month
    .startOf('M');
  result = result.add(parseInt(Math.random() * result.daysInMonth() + 1), 'd'); // day
  return result.toDate();
};
const randomValue = (val = 100, range = 20) => {
  return val - range + parseInt(Math.random() * range * 2);
};

module.exports = {
  init: async app => {
    let model = app.models.MaterialStock;
    // get all details type
    await mapSeries(
      materialDetailTypes,
      async detailType => {
        let currentData = await model.findOne({ where: { detailTypeId: detailType.id } });
        let data = {
          id: currentData ? currentData.id : undefined,
          name: detailType.name,
          type: detailType.type,
          initValue: detailType.type === 'Pipe' ? randomValue(100000, 20000) : randomValue(),
          dom: randomDom(),
          egeTime: 12 * randomValue(10, 2),
          usedTime: 0,
          detailTypeId: detailType.id,
        };
        return model.replaceOrCreate(dataUtil.defaultOperationData({ data, app }));
      },
      // eslint-disable-next-line no-console
      err => (err ? console.error('Test data MaterialStock error', err) : console.log('Test data MaterialStock OK!')),
    );
  },
};
