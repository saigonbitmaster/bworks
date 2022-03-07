'use strict';
const AsyncLock = require('async-lock');

module.exports = Autoincrease => {
  var lock = new AsyncLock({ timeout: 5000 });

  Autoincrease.getNumber = key => {
    const getNumberInternal = async key => {
      let data = await Autoincrease.findById(key);
      let result = 1;
      if (data) {
        result = data.current + 1;
        await Autoincrease.updateAll({ id: key }, { current: parseInt(result) });
      } else {
        await Autoincrease.create({ id: key, current: result });
      }
      return result;
    };

    return new Promise((resolve, reject) => {
      lock
        .acquire(`Autoincrease.getNumber.${key}`, function() {
          getNumberInternal(key).then(result => resolve(result));
        })
        .catch(function(err) {
          reject(err);
        });
    });
  };
};
