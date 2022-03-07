'use strict';
const util = require('util');
const eachOfSeries = util.promisify(require('async/eachOfSeries'));
const eachLimit = util.promisify(require('async/eachLimit'));
const data = require('../init-data-without-ids');

module.exports = async app => {
  if (!process.env.NODE_INIT_DATA) {
    return;
  }
  const createWhereFilter = sampleRecord => ({ where: { ...sampleRecord } });
  await eachOfSeries(data, async (items, modelName) => {
    let model = app.models[modelName];
    if (modelName === 'ClientFormat') {
      await model.destroyAll();
    }
    await eachLimit(items, 10, async item => {
      const filter = createWhereFilter(item);
      let current = await model.findOne(filter);
      if (current) {
        if (process.env.NODE_FORCE_INIT) {
          const { id, ...rest } = item;
          await current.updateAttributes(rest);
        }
      } else {
        try {
          await model.create(item);
        } catch (err) {
          return;
        }
      }
    });
  });
};
