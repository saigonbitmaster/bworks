'use strict';
const moment = require('moment-timezone');
// const get = require('lodash/get');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
// const aggregate = require('../../utils/aggregate');
module.exports = ClientMeterNumber => {
  ClientMeterNumber.offlineUpload = async (clientData, options) => {
    const syncOks = [];
    const syncErrors = [];
    if (clientData && clientData.length) {
      for (let i = 0; i < clientData.length; i++) {
        let meterData = clientData[i];
        try {
          const { termMonth: rawTermMonth, ...rest } = meterData;
          const termMonth = rawTermMonth.length == 7 ? rawTermMonth : moment(rawTermMonth).format('YYYY-MM');
          const termMonthId = `${meterData.clientId}-${termMonth}`;
          // check exist
          let current = await ClientMeterNumber.findOne({ where: { id: termMonthId } });
          if (current) {
            // update data
            const { invoiceData, exportInvoiceDate, paymentStatus, ...currentRest } = current.__data;
            let updateData = { ...currentRest, ...rest };
            updateData = await operationMeta({ data: updateData, options });
            await ClientMeterNumber.updateMonth(updateData);
          } else {
            // create new
            const defaultNewMonth = await ClientMeterNumber.getDefaultNewMonth(meterData.clientId, termMonth);
            if (!defaultNewMonth) {
              syncErrors[meterData.clientId];
              continue;
            }
            let newData = { ...defaultNewMonth, ...rest };
            newData = await operationMeta({ data: newData, options });
            await ClientMeterNumber.writeNewMonth(newData);
          }
          syncOks.push({ id: meterData.clientId });
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
          syncErrors.push({ id: meterData.clientId, error: e.message });
        }
      }
    }
    return { syncOks, syncErrors };
  };

  ClientMeterNumber.remoteMethod('offlineUpload', {
    accepts: [
      { arg: 'clientData', type: ['object'], required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
