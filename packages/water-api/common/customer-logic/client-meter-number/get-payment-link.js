'use strict';
const crypto = require('crypto');
const axios = require('axios').default;
const toString = require('lodash/toString');
const querystring = require('query-string');
const moment = require('moment-timezone');
const uuidv1 = require('uuid/v1');
const sortObjectByKey = require('../../utils/sort-object-by-key');
const {
  payment: { vnpay, momo },
} = require('../../../server/config.json');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.getPaymentLink = async (
    clientIp,
    einvoiceData,
    { service, returnUrl, redirectUrlQuerystring, originalUrl, token, notifyUrl },
  ) => {
    if (
      !einvoiceData.orderInfo ||
      !('amount' in einvoiceData) ||
      !einvoiceData.meterNumberId ||
      !einvoiceData.clientId
    ) {
      throw new Error('Missing required data to make payment');
    }

    switch (service) {
      case 'VNPAY': {
        if (!vnpay.vnp_TmnCode || !vnpay.vnp_HashSecret) {
          throw new Error('Missing critical data');
        }

        const transactionId = uuidv1();

        const paymentParameters = {
          vnp_Version: '2',
          vnp_Command: 'pay',
          vnp_TmnCode: vnpay.vnp_TmnCode,
          vnp_Locale: 'vn',
          vnp_CurrCode: 'VND',
          vnp_TxnRef: transactionId,
          vnp_OrderInfo: einvoiceData.orderInfo,
          vnp_OrderType: 'billpayment',
          vnp_Amount: einvoiceData.amount * 100,
          vnp_ReturnUrl: returnUrl,
          vnp_IpAddr: clientIp,
          // vnp_BankCode: 'VNPAYQR',
          vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        };
        const sortedPaymentParameters = sortObjectByKey(paymentParameters);

        const signedData = vnpay.vnp_HashSecret + querystring.stringify(sortedPaymentParameters, { encode: false });
        const secureHash = crypto
          .createHash('sha256')
          .update(signedData, 'utf8')
          .digest('hex');
        sortedPaymentParameters['vnp_SecureHashType'] = 'SHA256';
        sortedPaymentParameters['vnp_SecureHash'] = secureHash;
        const vnpPayUrl = vnpay.vnp_Url + '?' + querystring.stringify(sortedPaymentParameters, { encode: true });
        const transactionLog = {
          id: transactionId,
          clientId: einvoiceData.clientId,
          meterNumberId: einvoiceData.meterNumberId,
          extra: { token, originalUrl: originalUrl && originalUrl.replace('/#/', '') },
          service,
        };
        if (redirectUrlQuerystring) {
          transactionLog.extra.redirectUrlQuerystring = redirectUrlQuerystring;
        }
        await ClientMeterNumber.app.models.TransactionLog.create(transactionLog);

        return vnpPayUrl;
      }

      case 'MOMO': {
        if (!momo.partnerCode || !momo.accessKey || !momo.secretKey || !momo.baseUrl || !notifyUrl) {
          throw new Error('Missing critical data');
        }
        const transactionId = uuidv1();

        // Create request signature
        const queryStringSignature = querystring.stringify(
          {
            partnerCode: momo.partnerCode,
            accessKey: momo.accessKey,
            requestId: transactionId,
            amount: einvoiceData.amount,
            orderId: transactionId,
            orderInfo: einvoiceData.orderInfo,
            returnUrl,
            notifyUrl,
            extraData: '',
          },
          { encode: false, sort: false },
        );
        const signature = crypto
          .createHmac('sha256', momo.secretKey)
          .update(queryStringSignature, 'utf8')
          .digest('hex');
        // Create requesting payload with new data
        const payloadSignature = {
          partnerCode: momo.partnerCode,
          accessKey: momo.accessKey,
          requestId: transactionId,
          amount: toString(einvoiceData.amount),
          orderId: transactionId,
          orderInfo: einvoiceData.orderInfo,
          returnUrl,
          notifyUrl,
          extraData: '',
          requestType: 'captureMoMoWallet',
          signature,
        };

        // Get the redirect URL
        const fetchedMomoResponse = await axios({
          baseURL: momo.baseUrl,
          method: 'POST',
          url: '/gw_payment/transactionProcessor',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(JSON.stringify(payloadSignature)),
          },
          data: payloadSignature,
        }).catch(() => {
          // MoMo server went haywire
          throw new Error('error.MOMO_WENT_OFFLINE');
        });
        // Store details of currently visiting webpage
        if (fetchedMomoResponse.data && fetchedMomoResponse.data.payUrl) {
          const transactionLog = {
            id: transactionId,
            clientId: einvoiceData.clientId,
            meterNumberId: einvoiceData.meterNumberId,
            extra: { token, originalUrl: originalUrl && originalUrl.replace('/#/', '') },
            service,
          };
          if (redirectUrlQuerystring) {
            transactionLog.extra.redirectUrlQuerystring = redirectUrlQuerystring;
          }
          await ClientMeterNumber.app.models.TransactionLog.create(transactionLog);
          return fetchedMomoResponse.data.payUrl;
        } else {
          throw new Error(fetchedMomoResponse.data.localMessage || fetchedMomoResponse.data.message);
        }
      }

      default: {
        throw new Error('No payment service is selected');
      }
    }
  };
};
