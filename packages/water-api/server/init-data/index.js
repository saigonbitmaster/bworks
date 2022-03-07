'use strict';
const util = require('util');
const eachLimit = util.promisify(require('async/eachLimit'));
const eachOfSeries = util.promisify(require('async/eachOfSeries'));
const data = require('./data');

module.exports = async app => {
  await eachOfSeries(data, async (items, modelName) => {
    let model = app.models[modelName];
    await eachLimit(items, 10, async item => {
      if (!item.id) {
        throw new Error('is null', modelName, item);
      }
      let current = await model.findById(item.id);
      // let record = null;
      if (current) {
        if (process.env.NODE_FORCE_INIT) {
          const { id, ...rest } = item;
          await current.updateAttributes(rest);
        }
      } else {
        await model.create(item);
      }
    });
  });
};
