'use strict';
const toLower = require('lodash/toLower');
const createError = require('http-errors');
const querystring = require('query-string');
const Config = require('../../../server/config.json');
const Transaction = require('../../utils/transaction');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.cancelEInvoices = async ids => {
    let cancelSuccess = [], cancelErrors = [], result = [];
    let transaction = new Transaction(ClientMeterNumber);

    let session = transaction.start();
    if (ids.length == 0) {cancelErrors.push({error: "No selected eInvoice"}); return { cancelSuccess, cancelErrors, result }; }

    for (let id of ids) {
      try {
        console.log(id)
        let invoice = await ClientMeterNumber.app.models.EInvoiceData.findById(id);
        let invoiceIssuedDate = invoice.eInvoiceDate;
        console.log(id, invoice, invoiceIssuedDate)
        await ClientMeterNumber.app.models.EInvoiceData.cancelEinvoice(id, invoiceIssuedDate, session);
        cancelSuccess.push({success: `cancel success: ${id}`})
      }
      catch (e) {
        cancelErrors.push({error: `cancel error: ${id}`})
      }
    }
    
    return { cancelSuccess, cancelErrors, result };
  };

  ClientMeterNumber.remoteMethod('cancelEInvoices', {
    accepts: [{ arg: 'ids', type: ['string'], required: true }],
    returns: { arg: 'data', type: 'object', root: true },
  });
}

