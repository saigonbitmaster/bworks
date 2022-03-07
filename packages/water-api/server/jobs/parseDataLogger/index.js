'use strict';
const csv = require('./csv');
const collectCsvDay = require('./collect-csv-day');
const runHour = async ({ app }) => {
  console.log('start run parse datalogger hour....');
  const src = await app.models.NmsConfig.getConfigByKey('srcDatalogger');
  switch (src.value) {
    case 'csv': {
      csv({ app });
      break;
    }
    case 'cloud':
      break;
    default:
      break;
  }
  console.log('end run parse datalogger hour....');
};
const runDay = async ({ app }) => {
  console.log('start run parse datalogger day....');
  const src = await app.models.NmsConfig.getConfigByKey('srcDatalogger');
  switch (src.value) {
    case 'csv': {
      collectCsvDay({ app });
      break;
    }
    case 'cloud':
      break;
    default:
      break;
  }
  console.log('end run parse datalogger hour....');
};
module.exports = { runHour, runDay };
