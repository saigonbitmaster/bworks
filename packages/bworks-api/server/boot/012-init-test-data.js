'use strict';
const util = require('util');
const eachOfSeries = util.promisify(require('async/eachOfSeries'));
const eachLimit = util.promisify(require('async/eachLimit'));
const data = require('../test-data');

module.exports = async app => {
  if (!process.env.NODE_INIT_TEST_DATA) {
    return;
  }
  const createWhereFilter = sampleRecord => ({ where: { ...sampleRecord } });
  await eachOfSeries(data, async (items, modelName) => {
    let model = app.models[modelName];
    await eachLimit(items, 10, async item => {
      const filter = createWhereFilter(item);
      const current = await (item.id ? model.findById(item.id) : model.findOne(filter));
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
