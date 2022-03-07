'use strict';
// const get = require('lodash/get');
// const aggregate = require('../../utils/aggregate');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');

module.exports = Client => {
  Client.offlineUpload = async (clientData, options) => {
    const syncOks = [];
    const syncErrors = [];
    if (options.accessToken && clientData && clientData.length) {
      for (let i = 0; i < clientData.length; i++) {
        const item = clientData[i];
        const { id, name, qrCode, position } = item;
        try {
          let update = false;
          if (qrCode) {
            let clientMeter = await Client.app.models.ClientMeter.findOne({
              where: { clientId: id, qrCode: { neq: qrCode } },
            });
            if (clientMeter) {
              clientMeter.qrCode = qrCode;
              clientMeter = await operationMeta({ data: clientMeter, options });
              await clientMeter.save();
              update = true;
            }
          }
          let client = await Client.findById(id);
          if (client) {
            client.name = name;
            client.position = position;
            client = await operationMeta({ data: client, options });
            await client.save();
            update = true;
          }
          if (update) {
            syncOks.push({ id });
          }
        } catch (e) {
          console.log(e); // eslint-disable-line no-console
          syncErrors.push({ id, error: e.message });
        }
      }
    }

    return { syncOks, syncErrors };
  };

  Client.remoteMethod('offlineUpload', {
    accepts: [
      { arg: 'clientData', type: 'array', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
