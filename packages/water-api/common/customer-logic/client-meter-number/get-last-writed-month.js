'use strict';
const { get } = require('lodash');
const moment = require('moment-timezone');
module.exports = ClientMeterNumber => {
  ClientMeterNumber.getLastWritedMonth = async (clientId = null, options) => {
    if (!clientId) {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await ClientMeterNumber.app.models.ClientUser.findById(userId);
      clientId = currentUser.clientId;
    }
    const client = await ClientMeterNumber.app.models.Client.findById(clientId);
    const { termMeterNumber } = client;
    const lastWritedMonth = await ClientMeterNumber.findById(
      `${clientId.toString()}-${moment(termMeterNumber).format('YYYY-MM')}`,
    );
    if (lastWritedMonth) {
      return { lastWritedMonth, termMonth: termMeterNumber || '' };
    } else {
      // tạo dữ liệu ban đầu
      const { startMeterDate } = client;
      const [clientMeter] = (await ClientMeterNumber.app.models.ClientMeter.find({ where: { clientId } })) || [];
      const { startMeterNumber } = clientMeter || {};
      return { lastWritedMonth: { currentNumber: Number(startMeterNumber), toDate: startMeterDate } };
    }
  };
  ClientMeterNumber.remoteMethod('getLastWritedMonth', {
    http: { verb: 'get' },
    accepts: [
      { arg: 'clientId', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
