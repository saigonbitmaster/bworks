'use strict';
const moment = require('moment-timezone');

module.exports = (rawLatestEinvoice, ...args) => {
  // Validate date to create replacement einvoice
  // 1. Must not in the future (smaller than current date) and larger or equal to latest einvoice date
  // 2. Must not later than 1 month from the latest einvoice date
  const currentDate = moment();
  const latestEinvoice = moment(rawLatestEinvoice).startOf('minute');
  let results = [];

  for (let arg of args) {
    if (!arg) {
      return false;
    }
    const date = moment(arg, 'DD/MM/YYYY HH:mm').startOf('minute');
    if (
      date.isSameOrBefore(currentDate) &&
      date.isSameOrAfter(latestEinvoice) &&
      Math.abs(date.diff(moment(latestEinvoice), 'months', true)) <= 1
    ) {
      results.push(true);
    }
  }

  const finalResult = results.filter(i => i).length === args.length ? true : false;
  return finalResult;
};
