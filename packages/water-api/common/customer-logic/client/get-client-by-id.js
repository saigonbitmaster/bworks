'use strict';
module.exports = function(Client) {
  Client.getClientById = async function(id, filter, options) {
    const record = await Client.findById(id, filter, options);
    if (record) {
      // get qr code
      const clientMeter = await Client.app.models.ClientMeter.findOne({
        where: { clientId: id },
        fields: { qrCode: true },
      });
      if (clientMeter) {
        record.qrCode = clientMeter.qrCode;
      }
    }
    return record;
  };

  // get client hien thi tren map
  Client.remoteMethod('getClientById', {
    accepts: [
      { arg: 'id', type: 'string' },
      { arg: 'filter', type: 'object' },
      { arg: 'options', type: 'object' },
    ],
    http: { verb: 'get' },
    returns: { root: true, type: 'object' },
  });
};
