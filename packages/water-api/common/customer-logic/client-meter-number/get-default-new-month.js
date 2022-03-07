'use strict';
const createError = require('http-errors');
const moment = require('moment-timezone');
module.exports = ClientMeterNumber => {
  const getInfoFromMeterHistory = async (id, ClientMeterNumber, Client, month) => {
    // case delete data
    let ClientMeterHistory = ClientMeterNumber.app.models.ClientMeterHistory;
    let data = {};
    let record = await ClientMeterHistory.findOne({ where: { clientId: id }, order: 'setupDate ASC' });
    if (!record) throw createError(400, `error.METER_WRONG_SETUP_DATE`);
    if (month.diff(record.setupDate, 'month', true) < 0 || month.isSame(record.setupDate, 'month'))
      throw createError(400, 'error.METER_WRONG_SETUP_DATE');
    if (typeof +Client.lastMeterNumber === 'number' && typeof Client.lastTimeMeterNumberUpdate === 'object') {
      data.fromDate = record.setupDate;
      
      if (moment(Client.lastTimeMeterNumberUpdate).month() !== moment(record.setupDate).month() || moment(Client.lastTimeMeterNumberUpdate).year() !== moment(record.setupDate).year()) {
        data.fromDate = Client.lastTimeMeterNumberUpdate;
      }
      data.clientId = id;
      data.previousNumber = +record.newMeterNumber;
      return data;
    }
    return;
  };
  // yearMonth: 2018-09
  ClientMeterNumber.getDefaultNewMonth = async (id, yearMonth) => {
    let result = {};
    let month = moment(yearMonth.length == 7 ? yearMonth + '-01' : yearMonth);
    const fixYearMonth = moment(month).format('YYYY-MM');
    // reject future month
    let diff = moment().diff(month, 'month');
    if (diff < 0 || diff > 12) throw createError(400, 'error.METER_TOO_OLD'); // one year only

    let Client = await ClientMeterNumber.app.models.Client.findById(id);
    if (!Client || (Client && Client.status !== 'ACTIVE')) return;
    let record = await ClientMeterNumber.findOne({ where: { clientId: id }, order: 'toDate DESC' });

    if (!record) {
      result = await getInfoFromMeterHistory(id, ClientMeterNumber, Client, month);
    } else {
      if (record.id === `${id}-${fixYearMonth}`) {
        throw createError(400, 'error.CLIENT_METER_ID_ALREADY_EXIST');
      }
      result.fromDate = record.toDate;
      result.clientId = record.clientId;
      result.previousNumber = record.currentNumber;
    }
    // get default toDate
    let writeNumberDateConfig = await ClientMeterNumber.app.models.CtmConfig.findById('ClientWriteMeterNumberDate');
    if (!writeNumberDateConfig) throw createError(400, 'error.METER_MISSING_CONFIG_WRITE_DATE');
    result.toDate = moment(result.fromDate)
      .add(1, 'month')
      .date(writeNumberDateConfig.value)
      .toDate();
    result.id = `${result.clientId}-${fixYearMonth}`;

    // check meter change
    let history = await ClientMeterNumber.app.models.ClientMeterHistory.findOne({
      where: { clientId: id, type: 'REPLACE' },
      order: 'setupDate DESC',
    });
    if (history && moment(history.setupDate).isBetween(moment(result.fromDate), moment(result.toDate), null, '[)')) {
      result.isChangeMeter = true;
      result.previousNumber = history.newMeterNumber;
    }
    return result;
  };
  ClientMeterNumber.remoteMethod('getDefaultNewMonth', {
    http: { path: '/getDefaultNewMonth/:id/:yearMonth', verb: 'get' },
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'yearMonth', type: 'string', required: true },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
