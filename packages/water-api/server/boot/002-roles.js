'use strict';
const ctmWardInCharge = require('./roles/ctm-ward-in-charge');

module.exports = app => {
  ctmWardInCharge(app);
};
