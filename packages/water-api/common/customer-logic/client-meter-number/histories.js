'use strict';
const moment = require('moment-timezone');
// const { get } = require('lodash');
// const createError = require('http-errors');

// remote method cho client
module.exports = ClientMeterNumber => {
  ClientMeterNumber.histories = async (
    clientId,
    limit = 6,
    beforeDate = moment()
      .endOf('month')
      .toDate(),
  ) => {
    const histories = await ClientMeterNumber.find({
      where: { clientId: clientId, toDate: { lt: beforeDate } },
      fields: {
        id: true,
        clientId: true,
        fromDate: true,
        toDate: true,
        previousNumber: true,
        currentNumber: true,
        invoiceData: true,
      },
      order: 'toDate DESC',
      limit,
    });
    return histories;
  };

  ClientMeterNumber.remoteMethod('histories', {
    accepts: [
      { arg: 'clientId', type: 'string', required: true },
      { arg: 'limit', type: 'number' },
      { arg: 'beforeDate', type: 'date' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
