'use strict';
const moment = require('moment-timezone');

module.exports = (Model, condition = {}, options) => {
  let fixCondition = { ...condition };
  fixCondition = fixCondition.where ? fixCondition.where : fixCondition;
  convertDate(fixCondition);
  return Model.dataSource.adapter.buildWhere.apply(Model.getConnector(), [Model.name, fixCondition, options]);
};

const convertDate = (obj, deep = 0) => {
  for (let k in obj) {
    if (obj[k] && typeof obj[k] === 'object') {
      if (deep < 4) {
        convertDate(obj[k], deep + 1);
      }
    } else if (typeof obj[k] === 'string' && obj[k].length === 24) {
      let d = moment(obj[k]);
      if (d.isValid()) {
        obj[k] = d.toDate();
      }
    }
  }
};
