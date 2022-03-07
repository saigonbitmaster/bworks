'use strict';
// const createError = require('http-errors');
module.exports = function(ClientRequest) {
  ClientRequest.replaceMeterRequest = async (data, options) => {
    // check valid serial
    // if (data.serial) {
    //   let res = await ClientRequest.app.models.Client.find({ where: { serial: data.serial } });
    //   if (res && res.length) {
    //     throw createError(400, 'error.DUPLICATE_SERIAL');
    //   }
    // }
    data.status = 'NEW';
    data.type = 'REPLACE';
    const record = await ClientRequest.createRequest(data, options);
    return record;
  };
  ClientRequest.remoteMethod('replaceMeterRequest', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
