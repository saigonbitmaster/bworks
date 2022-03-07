'use strict';
const initData = require('../init-data');

module.exports = async app => {
  if (process.env.NODE_INIT_DATA) {
    await initData(app);
  }
};
