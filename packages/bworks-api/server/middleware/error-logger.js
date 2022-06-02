'use strict';
const app = require('../server');

// eslint-disable-next-line no-unused-vars
module.exports = function(options) {
  const cloneObjectValues = obj => {
    let result = {};
    Object.keys(obj).map(key => {
      let item = obj[key];
      let itemType = typeof item;
      if (itemType === 'string' || itemType === 'number') {
        result[key] = item;
      }
    });
    return result;
  };
  return (err, req, res, next) => {
    let data = {
      host: req.hostname,
      ip: req.ip,
      name: err.name,
      error: {
        ...cloneObjectValues(err),
        stack: err.stack,
      },
      req: {
        ...cloneObjectValues(req || {}),
        protocol: req.protocol,
        headers: req.headers,
        query: req.query,
      },
      res: {
        ...cloneObjectValues(res || {}),
      },
      time: new Date(),
    };
    app.models.ErrorLog.create(data).catch(() => {});
    next(err);
  };
};
