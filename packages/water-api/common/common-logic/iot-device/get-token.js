'use strict';
const str = require('string-to-stream');

module.exports = function(Iotdevice) {
  Iotdevice.getToken = (id, req, callback) => {
    const host = req.headers.host;
    Iotdevice.findOne({ where: { id }, fields: { id: true, secrets: true } }).then(device => {
      if (device) {
        const contentType = 'application/json';
        const contentDisposition = `attachment; filename="${device.id}.json"`;
        const data = JSON.stringify({ organization: host, key: device.id, secret: device.secrets[0] }, null, ' ');
        return callback(null, str(data), contentType, contentDisposition);
      } else {
        return callback('Device does not exist');
      }
    });
  };
  Iotdevice.remoteMethod('getToken', {
    description: 'Get IoT device token',
    accessType: 'READ',
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'req', type: 'object', http: { source: 'req' } },
    ],
    http: {
      verb: 'get',
    },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
