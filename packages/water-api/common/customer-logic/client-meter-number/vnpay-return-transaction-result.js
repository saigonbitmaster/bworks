'use strict';
const crypto = require('crypto');
const querystring = require('query-string');
const url = require('url');
const has = require('lodash/has');
const get = require('lodash/get');
const set = require('lodash/set');
const sortObjectByKey = require('../../utils/sort-object-by-key');
const {
  payment: { vnpay },
} = require('../../../server/config.json');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.vnpayReturnTransactionResult = async (req, res) => {
    const vnPayResult = req.query;
    if (!vnPayResult['access_token']) {
      return;
    }
    const responseCode = vnPayResult['vnp_ResponseCode'];
    const secureHash = vnPayResult['vnp_SecureHash'];
    const sentToken = vnPayResult['access_token'];

    delete vnPayResult['access_token'];
    delete vnPayResult['vnp_SecureHash'];
    delete vnPayResult['vnp_SecureHashType'];

    const sortedVnPayResult = sortObjectByKey(vnPayResult);
    const signedData = vnpay.vnp_HashSecret + querystring.stringify(sortedVnPayResult, { encode: false });
    const checkSum = crypto
      .createHash('sha256')
      .update(signedData, 'utf8')
      .digest('hex');

    // Check if queueing transaction is still there
    const transactionId = vnPayResult['vnp_TxnRef'];
    const transaction = await ClientMeterNumber.app.models.TransactionLog.findById(transactionId);
    if (!transaction) {
      transactionSignal = 'notExist';
    }
    if (!transaction.extra.token || transaction.extra.token !== sentToken) {
      return;
    }
    const transactionAmount = parseInt(parseInt(vnPayResult['vnp_Amount'], 10) / 100, 10);
    const { meterNumberId } = transaction;
    const paidMeterNumber = await ClientMeterNumber.findOne({ where: { id: meterNumberId } });
    const paidInvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
      where: { id: meterNumberId },
      fields: { clientMeterNumberItem: true },
    });
    const clonedTransaction = transaction.toJSON();

    // Mark this redirection as `visited`
    await transaction.updateAttribute('returned', true);

    // Handle special response codes
    let transactionSignal = responseCode;
    if (secureHash === checkSum) {
      if (responseCode === '00') {
        transactionSignal = '00';
      }

      if (clonedTransaction.returned) {
        transactionSignal = 'returned';
      }
      if (
        paidInvoice.clientMeterNumberItem.invoiceData.totalFee !== transactionAmount ||
        paidMeterNumber.invoiceData.totalFee !== transactionAmount
      ) {
        transactionSignal = 'amountNotMatched';
      }
    } else {
      transactionSignal = 'invalidSignature';
    }

    let redirectUrlObject = {};
    let redirectUrl = null;
    let addClient = false;
    if (has(clonedTransaction, 'extra.originalUrl') && get(clonedTransaction, 'extra.originalUrl').endsWith('client')) {
      addClient = true;
    }
    if (has(clonedTransaction, 'extra.redirectUrlQuerystring')) {
      // Replace the old transactionSignal with a new one, if existing
      const cleanedRedirectParamObject = querystring.parse(transaction.extra.redirectUrlQuerystring);

      redirectUrlObject = {
        query: {
          ...cleanedRedirectParamObject,
          transactionSignal,
          service: 'vnpay',
        },
      };
    } else {
      redirectUrlObject = {
        query: {
          transactionSignal,
          service: 'vnpay',
        },
      };
    }

    if (addClient) {
      set(redirectUrlObject, 'pathname', '/client');
    } else {
      set(redirectUrlObject, 'pathname', '/');
    }
    redirectUrl = url.format(redirectUrlObject);

    // Prevent redirection caching
    res.set({ 'Cache-Control': 'no-store, no-cache' });
    res.redirect(301, redirectUrl);
  };

  ClientMeterNumber.remoteMethod('vnpayReturnTransactionResult', {
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
  });
};
