'use strict';
const moment = require('moment-timezone');

module.exports = function(Client) {
  Client.getLastWriteMeterNumber = async function(clientId) {
    const currentClient = await Client.findById(clientId);
    const { termMeterNumber, id } = currentClient;
    const lastWritedMeterNumberId = `${id}-${moment(termMeterNumber).format('YYYY-MM')}`;
    const lastWritedMeterNumber = await Client.app.models.ClientMeterNumber.findById(lastWritedMeterNumberId);
    return lastWritedMeterNumber;
  };

  // get client hien thi tren map
  Client.remoteMethod('getClientByGeo', {
    accepts: [{ arg: 'clientId', type: 'object', require: true }],
    http: { verb: 'post' },
    returns: { root: true, type: Array },
  });
};
