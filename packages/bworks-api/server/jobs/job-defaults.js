'use strict';
// const moment = require('moment-timezone');

const demo = require('./example/demo');

// eslint-disable-next-line no-unused-vars
module.exports = app => {
  let systemJobs = {};
  //systemJobs.jobQualityHourly = { time: '0 */1 * * * *', execute: demo.demoJob, options: {} };
  return systemJobs;
};
