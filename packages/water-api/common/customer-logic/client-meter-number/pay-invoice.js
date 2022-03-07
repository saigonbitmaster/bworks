'use strict';
const toLower = require('lodash/toLower');
const createError = require('http-errors');
const querystring = require('query-string');
const Config = require('../../../server/config.json');

module.exports = ClientMeterNumber => {
  ClientMeterNumber.payInvoiceByAdmin = async ids => {
    const clientsMeterNumber = await ClientMeterNumber.find({
      where: { id: { inq: ids } },
      fields: { clientId: true, id: true },
    });
    const paysSuccess = [];
    const paysError = [];
    let result = 0;

    if (clientsMeterNumber && clientsMeterNumber.length) {
      for (let i = 0; i < clientsMeterNumber.length; i++) {
        const meterData = clientsMeterNumber[i];
        const { clientId, id } = meterData;
        try {
          const validateClient = await ClientMeterNumber.app.models.Client.findOne({
            where: { id: clientId },
          });
          // Einvoice ID is similar to client meter number ID
          const validateEinvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
            where: { id },
          });
          if (validateClient && validateEinvoice) {
            await ClientMeterNumber.updateAll({ id }, { paymentStatus: true }, err => {
              if (err) {
                throw createError(400, 'error.DATA_INVALID');
              }
              paysSuccess.push({ id });
              result += 1;
            });
            await ClientMeterNumber.app.models.Client.calculateDebt([clientId.toString()]);
          } else {
            throw createError(400, 'error.CLIENT_NOT_EXIST');
          }
        } catch (error) {
          paysError.push({ id, error: error.message });
        }
      }
    }
    return { paysSuccess, paysError, result };
  };

  ClientMeterNumber.remoteMethod('payInvoiceByAdmin', {
    accepts: [{ arg: 'ids', type: ['string'], required: true }],
    returns: { arg: 'data', type: 'number', root: true },
  });

  ClientMeterNumber.payInvoice = async (orderInfo, service, id, originalUrl, req) => {
    const invoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
      where: { id },
      fields: { id: true, clientMeterNumberItem: true },
    });

    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const lowerCasedServiceName = toLower(service);
    const {
      query: { access_token },
    } = querystring.parseUrl(req.originalUrl);
    const returnUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`.replace(
      'payInvoice',
      `${lowerCasedServiceName}ReturnTransactionResult`,
    );
    const notifyUrl = `${req.protocol.startsWith('http') ? 'https' : req.protocol}://${req.get(
      'host',
    )}/api/payments/${lowerCasedServiceName}Ipn`;

    const redirectUrlQuerystring = originalUrl.split('?')[1];

    if (invoice) {
      const {
        id,
        clientMeterNumberItem: {
          clientId,
          invoiceData: { totalFee },
        },
      } = invoice;
      try {
        const validateClient = await ClientMeterNumber.app.models.Client.findOne({
          where: { id: clientId },
        });
        // Einvoice ID is similar to client meter number ID
        const validateEinvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
          where: { id },
        });
        if (validateClient && validateEinvoice) {
          const qrPaymentLink = await ClientMeterNumber.getPaymentLink(
            clientIp,
            { orderInfo, amount: totalFee, meterNumberId: id, clientId },
            {
              service,
              notifyUrl,
              returnUrl,
              originalUrl,
              redirectUrlQuerystring,
              token: access_token,
            },
          );
          return qrPaymentLink;
        } else {
          throw createError(400, 'error.CLIENT_NOT_EXIST');
        }
      } catch (error) {
        throw createError(500, error.message);
      }
    }
  };

  ClientMeterNumber.remoteMethod('payInvoice', {
    accepts: [
      { arg: 'orderInfo', type: 'string', required: true },
      { arg: 'service', type: 'string', required: true },
      { arg: 'id', type: 'string', required: true },
      { arg: 'originalUrl', type: 'string', required: true },
      { arg: 'req', type: 'object', http: { source: 'req' } },
    ],
    returns: { arg: 'data', type: 'string', root: true },
  });

  ClientMeterNumber.payInvoiceInApp = async (orderInfo, service, id, originalUrl, req) => {
    const invoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
      where: { id },
      fields: { id: true, clientMeterNumberItem: true },
    });

    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    const lowerCasedServiceName = toLower(service);
    const {
      query: { access_token },
    } = querystring.parseUrl(req.originalUrl);
    // const notifyUrl = `${req.protocol.startsWith('http') ? 'https' : req.protocol}://${req.get(
    //   'host',
    // )}/api/payments/${lowerCasedServiceName}Ipn`;
    const isDevelopment = !!(!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
    const notifyUrl = isDevelopment
      ? `https://${Config.payment.developmentReturnUrl}/api/payments/${lowerCasedServiceName}Ipn`
      : `${req.protocol.startsWith('http') ? 'https' : req.protocol}://${req.get(
          'host',
        )}/api/payments/${lowerCasedServiceName}Ipn`;
    if (invoice) {
      const {
        id,
        clientMeterNumberItem: {
          clientId,
          invoiceData: { totalFee },
        },
      } = invoice;
      try {
        const validateClient = await ClientMeterNumber.app.models.Client.findOne({
          where: { id: clientId },
        });
        // Einvoice ID is similar to client meter number ID
        const validateEinvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
          where: { id },
        });
        if (validateClient && validateEinvoice) {
          const qrPaymentLink = await ClientMeterNumber.getPaymentLink(
            clientIp,
            { orderInfo, amount: totalFee, meterNumberId: id, clientId },
            {
              service,
              notifyUrl,
              returnUrl: originalUrl,
              token: access_token,
            },
          );
          return qrPaymentLink;
        } else {
          throw createError(400, 'error.CLIENT_NOT_EXIST');
        }
      } catch (error) {
        throw createError(500, error.message);
      }
    }
  };
  ClientMeterNumber.remoteMethod('payInvoiceInApp', {
    accepts: [
      { arg: 'orderInfo', type: 'string', required: true },
      { arg: 'service', type: 'string', required: true },
      { arg: 'id', type: 'string', required: true },
      { arg: 'originalUrl', type: 'string', required: true },
      { arg: 'req', type: 'object', http: { source: 'req' } },
    ],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'string', root: true },
  });

  ClientMeterNumber.remoteMethod('payInvoiceByEmployee', {
    accepts: [{ arg: 'ids', type: ['string'], required: true }],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'string', root: true },
  });

  ClientMeterNumber.payInvoiceByEmployee = async ids => {
    const clientsMeterNumber = await ClientMeterNumber.find({
      where: { id: { inq: ids } },
      fields: { clientId: true, id: true },
    });
    const paysSuccess = [];
    const paysError = [];
    let result = 0;

    if (clientsMeterNumber && clientsMeterNumber.length) {
      for (let i = 0; i < clientsMeterNumber.length; i++) {
        const meterData = clientsMeterNumber[i];
        const { clientId, id } = meterData;
        try {
          const validateClient = await ClientMeterNumber.app.models.Client.findOne({
            where: { id: clientId },
          });
          // Einvoice ID is similar to client meter number ID
          const validateEinvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
            where: { id },
          });
          if (validateClient && validateEinvoice) {
            await ClientMeterNumber.updateAll({ id }, { paymentStatus: true }, err => {
              if (err) {
                throw createError(400, 'error.DATA_INVALID');
              }
              paysSuccess.push({ id });
              result += 1;
            });
            await ClientMeterNumber.app.models.Client.calculateDebt([clientId.toString()]);
          } else {
            throw createError(400, 'error.CLIENT_NOT_EXIST');
          }
        } catch (error) {
          paysError.push({ id, error: error.message });
        }
      }
    }
    return { paysSuccess, paysError, result };
  };
};
