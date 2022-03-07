'use strict';
const moment = require('moment-timezone');
const { get } = require('lodash');
const createError = require('http-errors');

// remote method cho client
module.exports = ClientMeterNumber => {
  ClientMeterNumber.getInvoiceDetail = async (time, options) => {
    const userId = get(options, 'accessToken.userId');
    const currentUser = await ClientMeterNumber.app.models.ClientUser.findById(userId);
    const clientId = currentUser.clientId;
    const clientMeterNumberId = `${clientId}-${moment(time, 'MM/YYYY').format('YYYY-MM')}`;
    const clientMeterNumber = await ClientMeterNumber.findById(clientMeterNumberId);
    if (!clientMeterNumber) {
      throw createError(400, 'error.CLIENT_METER_NUMBER_NOT_FOUND');
    }
    const { paymentStatus, paymentDate, previousNumber, currentNumber } = clientMeterNumber;
    const eInvoice = await ClientMeterNumber.app.models.EInvoiceData.findById(clientMeterNumberId);
    if (!eInvoice) {
      throw createError(400, 'error.EINVOICE_NOT_FOUND');
    }
    const {
      clientMeterNumberItem: { invoiceData: { totalFee, totalWaterUsed, client: { code } = {} } = {} } = {},
      id,
    } = eInvoice;
    return {
      eInvoiceId: id,
      totalFee,
      previousNumber,
      currentNumber,
      totalWaterUsed,
      orderInfo: `Thanh toán hoá đơn KH ${code} tháng ${time}`,
      paymentStatus,
      paymentDate,
    };
  };

  ClientMeterNumber.remoteMethod('getInvoiceDetail', {
    accepts: [
      { arg: 'time', type: 'string', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
