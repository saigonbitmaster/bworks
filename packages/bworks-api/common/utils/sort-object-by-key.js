'use strict';
const lodash = require('lodash');

module.exports = object =>
  lodash(object)
    .toPairs()
    .orderBy([0], ['asc'])
    .fromPairs()
    .value();
