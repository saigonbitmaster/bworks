'use strict';
// const moment = require('moment-timezone');
const httpError = require('http-errors');

module.exports = ClientMeter => {
  // chinh sua dong khach hang => update startMeterDate
  ClientMeter.editClientMeter = async (id, { data }) => {
   
    let { setupDate, serial, providerId, dmaId } = data;
    // if (serial) {
    //   let cdt = {};
    //   cdt.where = {
    //     and: [{ id: { neq: id } }, { serial }],
    //   };
    //   let records = await ClientMeter.find(cdt);
    //   if (records && records.length) {
    //     throw createError(400, 'error.DUPLICATE_SERIAL');
    //   }
    // }
    const currentMeter = await ClientMeter.findById(id);
    if (currentMeter.clientId) {
      let record = await ClientMeter.app.models.Client.findById(currentMeter.clientId);
     
      if (record) {
        // let startMonth = moment(setupDate).startOf('month');
        await record.updateAttributes({
          startMeterDate: setupDate,
          // lastTimeMeterNumberUpdate: setupDate,
          // termInvoice: startMonth,
          // termMeterNumber: startMonth,
          serial,
          providerId,
          dmaId,
        })
        ;
      }
    }
    // save to ClientMeter
    try {
      let current = await ClientMeter.findById(id);
      return current.updateAttributes(data);
      // let record = await ClientMeter.replaceById(id, data);
      // return record;
    } catch (err) {
      // If edited data is not validated, modifying the error before throwing
      if (err.name && err.name === 'ValidationError') {
        if ('qrCode' in err.details.codes) {
          delete err.stack;
          delete err.details;
          throw httpError(err.statusCode, 'error.QR_CODE_EXISTED');
        }
      } else {
        throw err;
      }
    }
  };

  // chinh sua dong ho khach hang
  ClientMeter.remoteMethod('editClientMeter', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { path: '/editClientMeter/:id', verb: 'put' },
  });
};
