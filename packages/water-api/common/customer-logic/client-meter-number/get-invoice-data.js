'use strict';
const moment = require('moment-timezone');
const { get } = require('lodash');
const createError = require('http-errors');

// remote method cho client
module.exports = ClientMeterNumber => {
  ClientMeterNumber.getInvoiceData = async options => {
    try {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await ClientMeterNumber.app.models.ClientUser.findById(userId);
      if (!currentUser) throw createError(400, 'error.AUTHENTICATION_REQUIRED');
      const clientId = currentUser.clientId;
      const fromTime = moment()
        .subtract(1, 'years')
        .add(1, 'months');
      const toTime = moment();
      let index = 0;
      let listData = [];
      let chartData = [];
      for (
        let tmpDate = fromTime;
        tmpDate.isSameOrBefore(toTime, 'months');
        tmpDate = moment(tmpDate).add(1, 'months')
      ) {
        let pushList = false;
        let startMonth = moment(tmpDate).startOf('month');
        let endMonth = moment(tmpDate).endOf('month');
        const cdt = {
          where: {
            and: [{ clientId }, { toDate: { between: [startMonth, endMonth] } }],
          },
          order: 'toDate DESC',
        };
        cdt.order = 'toDate DESC';
        let record = {};
        let itemCMN = await ClientMeterNumber.findOne(cdt);
        if (itemCMN && itemCMN.invoiceData) {
          const {
            previousNumber,
            currentNumber,
            paymentStatus,
            paymentDate,
            invoiceData: { totalFee, totalWaterUsed, client: { code } = {} },
            id,
          } = itemCMN;
          record = {
            cmnId: id,
            previousNumber,
            paymentDate,
            clientCode: code,
            currentNumber,
            paymentStatus,
            totalWaterUsage: totalWaterUsed,
            totalInvoice: totalFee,
          };
          const invoiceId = id;
          const itemInvoice = await ClientMeterNumber.app.models.EInvoiceData.findOne({
            where: { id: invoiceId },
            fields: { eInvoiceNo: true },
          });
          if (itemInvoice && itemInvoice.eInvoiceNo) {
            record.invoiceNo = itemInvoice.eInvoiceNo;
            pushList = true;
          }
        }
        record.id = index;
        ++index;
        record.time = startMonth.format('MM/YYYY');
        if (pushList) listData.push(record);
        chartData.push(record);
      }
      return { listData, chartData };
    } catch (e) {
      throw e;
    }
  };

  ClientMeterNumber.remoteMethod('getInvoiceData', {
    accepts: [{ arg: 'options', type: 'object', http: 'optionsFromRequest' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
