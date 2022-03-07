'use strict';
const crypto = require('crypto');
const querystring = require('query-string');
const moment = require('moment-timezone');
const get = require('lodash/get');
const sortObjectByKey = require('../utils/sort-object-by-key');
const {
  utc,
  payment: { vnpay, momo },
} = require('../../server/config.json');

module.exports = function(Payment) {
  Payment.momoIpn = async (req, res) => {
    let errorCode = '99';
    let customMessage = 'Default error';
    const {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      orderType,
      transId,
      message,
      localMessage,
      responseTime,
      errorCode: sentErrorCode,
      payType,
      extraData,
      signature: sentSignature,
    } = req.body;

    const transactionId = orderId;
    const transaction = await Payment.app.models.TransactionLog.findById(transactionId);
    if (!transaction) {
      errorCode = '58';
      customMessage = 'Order not found';
    }

    try {
      const rawSignature = querystring.stringify(
        {
          partnerCode,
          accessKey,
          requestId,
          amount,
          orderId,
          orderInfo,
          orderType,
          transId,
          message,
          localMessage,
          responseTime,
          errorCode: sentErrorCode,
          payType,
          extraData,
        },
        { sort: false, encode: false },
      );

      const createdSignature = crypto
        .createHmac('sha256', momo.secretKey)
        .update(rawSignature, 'utf8')
        .digest('hex');

      if (sentSignature === createdSignature) {
        // Get transactional data from payload and storage
        const transactionAmount = parseInt(amount, 10);

        const { meterNumberId, clientId } = transaction;
        const paidMeterNumber = await Payment.app.models.ClientMeterNumber.findOne({ where: { id: meterNumberId } });
        if (paidMeterNumber.paymentStatus) {
          errorCode = '12';
          customMessage = 'Order already confirmed';
        }

        const paidInvoice = await Payment.app.models.EInvoiceData.findOne({
          where: { id: meterNumberId },
          fields: { clientMeterNumberItem: true },
        });
        if (
          paidInvoice.clientMeterNumberItem.invoiceData.totalFee !== transactionAmount ||
          paidMeterNumber.invoiceData.totalFee !== transactionAmount
        ) {
          errorCode = '42';
          customMessage = 'Invalid amount';
        }

        // Transaction done, update the payment status of client's invoice
        if (sentErrorCode === '0') {
          await Payment.app.models.ClientMeterNumber.updateAll(
            { id: meterNumberId },
            { paymentStatus: true, paymentDate: new Date() },
          );
          await Payment.app.models.ClientMeterNumber.app.models.Client.calculateDebt([clientId]);
        } else {
          errorCode = sentErrorCode;
          customMessage = message;
        }
      } else {
        errorCode = '5';
        customMessage = 'Signature doesnt match';
      }
    } catch (_) {
      errorCode = '4043';
      customMessage = 'System error';
    }

    const payloadResponseTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const payloadSignature = crypto
      .createHmac('sha256', momo.secretKey)
      .update(
        querystring.stringify(
          {
            partnerCode,
            accessKey,
            requestId,
            orderId,
            errorCode,
            message: customMessage,
            responseTime: payloadResponseTime,
            extraData: '',
          },
          { sort: false, encode: false },
        ),
        'utf8',
      )
      .digest('hex');

    const payload = {
      partnerCode,
      accessKey,
      requestId,
      orderId,
      errorCode,
      message: customMessage,
      responseTime: payloadResponseTime,
      extraData: '',
      signature: payloadSignature,
    };

    await transaction.updateAttribute('result', { code: errorCode, message: customMessage });

    res.set('Content-Type', 'application/json;charset=UTF-8');
    res.status(200);
    res.send(payload);
  };

  Payment.remoteMethod('momoIpn', {
    accepts: [
      { arg: 'req', type: 'object', http: { source: 'req' } },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'post' },
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  });

  Payment.vnpayIpn = async req => {
    let vnPayReturnedObject = { RspCode: '99', Message: 'Other error' };
    const vnPayResult = req.query;
    const transactionId = vnPayResult['vnp_TxnRef'];
    const transaction = await Payment.app.models.TransactionLog.findById(transactionId);
    if (!transaction) {
      vnPayReturnedObject = { RspCode: '01', Message: 'Order not found' };
    }

    try {
      const secureHash = vnPayResult['vnp_SecureHash'];

      delete vnPayResult['access_token'];
      delete vnPayResult['vnp_SecureHash'];
      delete vnPayResult['vnp_SecureHashType'];

      const sortedVnPayResult = sortObjectByKey(vnPayResult);
      const signedData = vnpay.vnp_HashSecret + querystring.stringify(sortedVnPayResult, { encode: false });
      const checkSum = crypto
        .createHash('sha256')
        .update(signedData, 'utf8')
        .digest('hex');

      const transactionId = vnPayResult['vnp_TxnRef'];
      const transaction = await Payment.app.models.TransactionLog.findById(transactionId);
      if (!transaction) {
        vnPayReturnedObject = { RspCode: '01', Message: 'Order not found' };
      }

      if (secureHash === checkSum) {
        // Get transaction ID
        const transactionAmount = parseInt(parseInt(vnPayResult['vnp_Amount'], 10) / 100, 10);
        const responseCode = vnPayResult['vnp_ResponseCode'];

        const { meterNumberId, clientId } = transaction;
        const paidMeterNumber = await Payment.app.models.ClientMeterNumber.findOne({ where: { id: meterNumberId } });
        if (paidMeterNumber.paymentStatus) {
          vnPayReturnedObject = { RspCode: '02', Message: 'Order already confirmed' };
        }

        const paidInvoice = await Payment.app.models.EInvoiceData.findOne({
          where: { id: meterNumberId },
          fields: { clientMeterNumberItem: true },
        });
        if (
          paidInvoice.clientMeterNumberItem.invoiceData.totalFee !== transactionAmount ||
          paidMeterNumber.invoiceData.totalFee !== transactionAmount
        ) {
          vnPayReturnedObject = { RspCode: '04', Message: 'Invalid amount' };
        }

        // Transaction done, update the payment status of client's invoice
        if (responseCode === '00') {
          await Payment.app.models.ClientMeterNumber.updateAll(
            { id: meterNumberId },
            { paymentStatus: true, paymentDate: new Date() },
          );
          await Payment.app.models.ClientMeterNumber.app.models.Client.calculateDebt([clientId]);
        }
      } else {
        vnPayReturnedObject = { RspCode: '97', Message: 'Invalid signature' };
      }
      vnPayReturnedObject = { RspCode: '00', Message: 'Confirm Success' };
    } catch (_) {
      vnPayReturnedObject = { RspCode: '99', Message: 'Other error' };
    }

    await transaction.updateAttribute('result', {
      code: get(vnPayReturnedObject, 'RspCode'),
      message: get(vnPayReturnedObject, 'Message'),
    });

    return vnPayReturnedObject;
  };

  Payment.remoteMethod('vnpayIpn', {
    accepts: [{ arg: 'req', type: 'object', http: { source: 'req' } }],
    http: { verb: 'get' },
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  });
};
