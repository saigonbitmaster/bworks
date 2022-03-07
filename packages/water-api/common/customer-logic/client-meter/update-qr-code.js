'user strict';
const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');

module.exports = function(ClientMeter) {
  ClientMeter.updateQrCode = async (clientId, qrCode, options) => {
    // get record
    let record = await ClientMeter.findOne({ where: { clientId } });
    if (record) {
      // check unique
      let count = await ClientMeter.count({ clientId: { neq: clientId }, qrCode });
      if (count > 0) {
        throw createError(400, 'error.QR_CODE_EXISTED');
      }
      const updateData = await operationMeta({ data: { qrCode }, options });
      return record.updateAttributes(updateData);
    }
    throw createError(400, 'error.CLIENT_NOT_FOUND');
  };
  ClientMeter.remoteMethod('updateQrCode', {
    accepts: [
      { arg: 'clientId', type: 'string' },
      { arg: 'qrCode', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
