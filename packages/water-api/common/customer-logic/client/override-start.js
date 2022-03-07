'use strict';
const util = require('util');
const moment = require('moment');
// const utilCommon = require('water-api/common/utils/common');
const eachLimit = util.promisify(require('async/eachLimit'));
module.exports = function(Client) {
  Client.overrideStart = async function(data) {
    const missing = [];
    const completed = [];

    const ClientMeter = Client.app.models.ClientMeter;
    const ClientRequest = Client.app.models.ClientRequest;
    const ClientMeterHistory = Client.app.models.ClientMeterHistory;
    const ClientMeterNumber = Client.app.models.ClientMeterNumber;
    let count = 0;

    await eachLimit(data, 100, async ({ code, serial, startNumber, startDate = moment('2018-12-05').toDate() }) => {
      const client = await Client.findOne({ where: { code } });

      if (client) {
        const startMonth = moment(startDate)
          // .subtract(1, 'month')
          .startOf('month')
          .toDate();
        // delete all clientMeterNumber
        await ClientMeterNumber.destroyAll({ clientId: client.id });

        const meter = await ClientMeter.findOne({ where: { clientId: client.id } });
        if (!meter) {
          return missing.push(code);
        }
        if (serial) {
          meter.serial = serial;
        }
        await meter.save();

        const request = await ClientRequest.findOne({ where: { clientId: client.id, type: 'NEW_INSTALL' } });
        if (!request) {
          return missing.push(code);
        }
        await ClientRequest.destroyAll({ clientId: client.id, type: { neq: 'NEW_INSTALL' } });
        await request.updateAttributes({
          qrCode: client.qrCode,
          startMeterDate: startDate,
          updatedDate: startDate,
          setupDate: startDate,
          startMeterNumber: startNumber,
        });

        const history = await ClientMeterHistory.findOne({ where: { clientId: client.id, type: 'NEW_INSTALL' } });
        if (!history) {
          return missing.push(code);
        }
        await ClientMeterHistory.destroyAll({ clientId: client.id, type: { neq: 'NEW_INSTALL' } });
        await history.updateAttributes({
          oldMeterNumber: startNumber,
          newMeterNumber: startNumber,
          updatedDate: startDate,
          setupDate: startDate,
        });
        // update client
        await client.updateAttributes({
          serial: serial ? serial : client.serial,
          lastMeterNumber: startNumber,
          lastTimeMeterNumberUpdate: startDate,
          contractStatus: 'ACTIVE',
          contractDate: startDate,
          startMeterDate: startDate,
          statusSurvey: true,
          resultSurvey: true,
          activeRequests: [],
          debt: 0,
          updatedDate: startDate,
          termInvoice: startMonth,
          termMeterNumber: startMonth,
        });
        count++;
        if (count % 50 == 0) {
          // eslint-disable-next-line no-console
          console.log(count);
        }
        completed.push(code);
      } else {
        missing.push(code);
      }
    });
    // eslint-disable-next-line no-console
    console.log('missing', missing);
    // eslint-disable-next-line no-console
    console.log('completed', completed);
    // eslint-disable-next-line no-console
    console.log('length', completed.length);
  };
};
