'use strict';
const util = require('util');
const moment = require('moment-timezone');
const eachSeries = util.promisify(require('async/eachSeries'));
const writeMeterNumber = {};

// GHI SO NUOC CHO [month]
// ex: month: '2018-09'
writeMeterNumber.writeAll = async (app, month) => {
  console.log('Start WRITE METER!'); // eslint-disable-line no-console
  let clients = await app.models.Client.find({});
  await eachSeries(clients, async client => {
    try {
      // console.log(client.name);
      // if (client.name !== 'a3') {
      //   return;
      // }
      // check valid date
      let { startMeterDate } = client;
      let startDateUse = moment(startMeterDate).startOf('month');
      let termMeter = moment(moment(month, 'YYYY-MM').toDate()).startOf('month');
      // console.log(startDateUse, termMeter);
      if (startDateUse.isAfter(termMeter)) {
        return;
      }
      let data = await app.models.ClientMeterNumber.getDefaultNewMonth(client.id, month);
      if (data) {
        // 5-25 m3
        let valMeter = Math.floor(Math.random() * 25 + 5);
        let input = {
          clientId: client.id,
          currentNumber: data.previousNumber + valMeter,
          fromDate: data.fromDate,
          id: data.id,
          previousNumber: data.previousNumber,
          toDate: data.toDate,
          paymentStatus: false,
        };
        // insert to database
        let res = await app.models.ClientMeterNumber.writeNewMonth(input);
        if (res) {
          console.log('client id:', client.id, 'name:', client.name, 'OK'); // eslint-disable-line no-console
        } else {
          console.log('client id:', client.id, 'name:', client.name, 'ERROR WRITE METER'); // eslint-disable-line no-console
        }
      } else {
        console.log('client id:', client.id, 'name:', client.name, 'EXIST'); // eslint-disable-line no-console
      }
    } catch (error) {
      console.log('client id:', client.id, 'name:', client.name, 'ERROR EXCEPTION', error); // eslint-disable-line no-console
    }
  });
  console.log('Completed WRITE METER!'); // eslint-disable-line no-console
};

module.exports = writeMeterNumber;
