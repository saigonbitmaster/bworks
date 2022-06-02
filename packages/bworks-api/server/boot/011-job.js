'use strict';
const { init } = require('../jobs');
module.exports = app => {
  init(app);
  /* if (process.env.NODE_JOB) {
    init(app);
  }*/
};