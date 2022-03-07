'use strict';

var AsyncLock = require('async-lock');
var lock = new AsyncLock();

module.export = async (key, func) => {
  return await new Promise((resolve, reject) => {
    lock
      .acquire(key, func, {})
      .then(function(data) {
        resolve(data);
      })
      .catch(e => {
        reject(e);
      });
  });
};
