'use strict';
const delay = require('delay');
const writeMeterNumber = require('./write-meter-number');
module.exports = async app => {
  if (process.env.OVERRIDE_CLIENT_START) {
    await delay(10000);
    const overrideData = require('./override-start-template');
    await app.models.Client.overrideStart(overrideData);
  }

  if (process.env.NODE_TEST) {
    // script: ghi so nuoc
    await writeMeterNumber.writeAll(app, '2018-09');
  }
};
