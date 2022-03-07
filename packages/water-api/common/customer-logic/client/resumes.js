'use strict';
const moment = require('moment-timezone');

module.exports = function(Client) {
  Client.resumes = async ids => {
    // to do, update some thing for continue write meter number's progress.
    let writeNumberDateConfig = await Client.app.models.CtmConfig.findById('ClientWriteMeterNumberDate');
    let day = 15;
    if (writeNumberDateConfig) {
      day = writeNumberDateConfig.value;
    }

    let toDate = moment(new Date())
      .subtract(1, 'month')
      .date(day)
      .toDate();
    let fromDate = moment(new Date())
      .subtract(2, 'month')
      .date(day)
      .toDate();

    let month = moment(toDate).get('month') + 1;
    let year = moment(toDate).get('year');

    let cdt = {};

    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];

      // status ?
      cdt.where = {
        id,
        status: { inq: ['STOP', 'PAUSE'] },
      };
      let client = await Client.find(cdt);
      if (!client || !client.length) {
        continue;
      }
      await Client.updateAll({ id, status: { inq: ['STOP', 'PAUSE'] } }, { status: 'ACTIVE' });

      let idPrevious = `${id}-${year}-${month}`;
      let itemPrevious = await Client.app.models.ClientMeterNumber.findById(idPrevious);
      // exist?
      if (itemPrevious) {
        continue;
      }

      cdt.where = { clientId: id };
      cdt.order = 'toDate DESC';
      let clientMeterNumber = await Client.app.models.ClientMeterNumber.findOne(cdt);
      if (!clientMeterNumber || !clientMeterNumber.__data) {
        continue;
      }

      let oldData = clientMeterNumber.__data;

      let invoiceData = {
        details: [
          {
            waterUsed: 0,
            from: 0,
            to: 0,
            factor: 1,
            name: '1',
            price: 0,
            toFee: 0,
          },
        ],
        sewagePercent: 0,
        sewageFee: 0,
        taxPercent: 0,
        taxFee: 0,
        waterFee: 0,
        totalFee: 0,
        totalWaterUsed: 0,
        invoiceNo: '',
        client: oldData.invoiceData.client,
        fromDate,
        toDate,
        oldMeterNumber: oldData.invoiceData.newMeterNumber,
        newMeterNumber: oldData.invoiceData.newMeterNumber,
      };

      let tmp = {
        id: idPrevious,
        fromDate,
        toDate,
        previousNumber: oldData.currentNumber,
        currentNumber: oldData.currentNumber,
        paymentStatus: true,
        clientId: id,
        invoiceData,
      };
      // console.log(tmp);
      // create new record
      await Client.app.models.ClientMeterNumber.create(tmp);

      // update client
      let data = {
        lastMeterNumber: oldData.currentNumber,
        lastTimeMeterNumberUpdate: toDate,
        termInvoice: moment(toDate)
          .startOf('month')
          .toDate(),
        termMeterNumber: moment(toDate)
          .startOf('month')
          .toDate(),
      };
      // console.log('client', data);
      await Client.updateAll({ id, status: { inq: ['STOP', 'PAUSE'] } }, data);
    }
    return {};
  };
  Client.remoteMethod('resumes', {
    accepts: [{ arg: 'ids', type: ['string'] }],
    returns: { root: true, type: 'object' },
  });
};
