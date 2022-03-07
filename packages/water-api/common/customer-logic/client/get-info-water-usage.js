'use strict';
const moment = require('moment');
const utilCommon = require('water-api/common/utils/common');

module.exports = function(Client) {
  Client.getInfoWaterUsage = async function(filter, res, options) {
    // console.log('getInfoWaterUsage', filter);
    try {
      let { time = moment(), perYear = true } = filter.where || {};
      let dataCollect = [];
      let dataCollectList = [];
      // let cdt = {};
      const token = options && options.accessToken;
      const userId = token && token.userId;
      if (!userId) {
        res.header('content-range', 0);
        return dataCollect;
      }
      let clientUser = await Client.app.models.ClientUser.findById(userId);
      if (!clientUser || !clientUser.clientId) {
        res.header('content-range', 0);
        return dataCollect;
      }
      let fromTime = perYear ? moment(time, 'YYYY').startOf('year') : moment(time).subtract(1, 'years');
      let toTime = perYear ? moment(time, 'YYYY').endOf('year') : moment(time);
      // console.log(fromTime);
      // console.log(toTime);
      let index = 0;

      for (
        let tmpDate = fromTime;
        tmpDate.isSameOrBefore(toTime, 'months');
        tmpDate = moment(tmpDate).add(1, 'months')
      ) {
        let startMonth = moment(tmpDate).startOf('month');
        let endMonth = moment(tmpDate).endOf('month');
        const cdt = {
          where: {
            and: [{ clientId: clientUser.clientId }, { toDate: { between: [startMonth, endMonth] } }],
          },
          order: 'toDate DESC',
        };
        cdt.order = 'toDate DESC';
        let pushList = false;
        let record = {};
        let itemCMN = await Client.app.models.ClientMeterNumber.findOne(cdt);
        if (itemCMN && itemCMN.invoiceData) {
          const {
            previousNumber,
            currentNumber,
            paymentStatus,
            invoiceData: { totalFee, totalWaterUsed, client: { code } = {} },
            id,
          } = itemCMN;
          record = {
            cmnId: id,
            previousNumber,
            clientCode: code,
            currentNumber,
            paymentStatus,
            totalWaterUsage: totalWaterUsed,
            totalInvoice: totalFee,
          };
          pushList = true;

          const invoiceId = id;
          const itemInvoice = await Client.app.models.EInvoiceData.findOne({
            where: { id: invoiceId },
            fields: { eInvoiceNo: true },
          });
          if (itemInvoice && itemInvoice.eInvoiceNo) {
            record.invoiceNo = itemInvoice.eInvoiceNo;
          }
        }

        record.id = index;
        ++index;
        record.time = startMonth.format('MM/YYYY');
        if (pushList) dataCollectList.push(record);
        dataCollect.push(record);
      }
      const { order } = filter;
      if (!order) {
        // return tat ca, dung cho CHART
        res.header('content-range', dataCollect.length);
        return dataCollect;
      }
      // dung cho LIST
      const data = perYear ? dataCollect : dataCollectList;
      return utilCommon.filterData(filter, data, res);
    } catch (error) {
      throw error;
    }
  };
  // site: ctm-client => get thong tin su dung nuoc
  Client.remoteMethod('getInfoWaterUsage', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
