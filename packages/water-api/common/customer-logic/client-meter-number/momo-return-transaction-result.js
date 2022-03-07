'use strict';
const crypto = require('crypto');
const url = require('url');
const querystring = require('query-string');
const has = require('lodash/has');
const get = require('lodash/get');
const set = require('lodash/set');
const {
  payment: { momo },
} = require('../../../server/config.json');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.momoReturnTransactionResult = async (req, res) => {
    const momoResult = req.query;
    // Get neccessary params
    const {
      access_token: sentToken,
      partnerCode,
      accessKey,
      requestId: transactionId,
      amount,
      orderInfo,
      orderType,
      transId,
      message,
      localMessage,
      responseTime,
      errorCode,
      payType,
      signature: sentSignature,
      extraData,
    } = momoResult;

    if (!sentToken) {
      return;
    }
    // Create request signature
    const queryStringSignature = querystring.stringify(
      {
        partnerCode,
        accessKey,
        requestId: transactionId,
        amount,
        orderId: transactionId,
        orderInfo,
        orderType,
        transId,
        message,
        localMessage,
        responseTime,
        errorCode,
        payType,
        extraData,
      },
      { encode: false, sort: false },
    );
    const createdSignature = crypto
      .createHmac('sha256', momo.secretKey)
      .update(queryStringSignature, 'utf8')
      .digest('hex');

    // Check if the queuing transaction is still there
    const transaction = await ClientMeterNumber.app.models.TransactionLog.findById(transactionId);
    if (!transaction) {
      transactionSignal = 'notExist';
    }
    if (!transaction.extra.token || transaction.extra.token !== sentToken) {
      return;
    }
    const transactionAmount = parseInt(amount, 10);
    const { meterNumberId } = transaction;
    const paidMeterNumber = await ClientMeterNumber.findOne({ where: { id: meterNumberId } });
    const paidInvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
      where: { id: meterNumberId },
      fields: { clientMeterNumberItem: true },
    });
    const clonedTransaction = transaction.toJSON();

    // Mark this redirection as `visited`
    await transaction.updateAttribute('returned', true);

    let transactionSignal = errorCode;
    const transactionMessage = `MoMo: ${localMessage || message}`;
    if (createdSignature === sentSignature) {
      if (clonedTransaction.returned) {
        transactionSignal = 'returned';
      } else if (
        paidInvoice.clientMeterNumberItem.invoiceData.totalFee !== transactionAmount ||
        paidMeterNumber.invoiceData.totalFee !== transactionAmount
      ) {
        transactionSignal = 'amountNotMatched';
      }
    } else {
      transactionSignal = '2129';
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
          message: transactionMessage,
          service: 'momo',
        },
      };
    } else {
      redirectUrlObject = {
        query: {
          transactionSignal,
          message: transactionMessage,
          service: 'momo',
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

  ClientMeterNumber.remoteMethod('momoReturnTransactionResult', {
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
  });
};
