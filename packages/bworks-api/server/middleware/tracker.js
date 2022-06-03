'use strict';
const debug = require('debug')('bworks-api:middleware:tracker');

module.exports = function() {
  return function tracker(req, res, next) {
    const { access_token, ...restQuery } = req.query;
    const info = {
      path: req.path,
      method: req.method,
      query: restQuery,
    };
    var start = process.hrtime();
    res.once('finish', function() {
      var diff = process.hrtime(start);
      info.time = diff[0] * 1e3 + diff[1] * 1e-6;
      debug(info);
    });
    next();
  };
};
