'use strict';
const createError = require('http-errors');
module.exports = Client => {
  Client.editClient = async (id, { data }) => {
    // console.log(data);
    let { code, contractNo, taxNo } = data;
    let records = [];
    let cdt = {};

    if (code) {
      cdt.where = {
        and: [{ id: { neq: id } }, { code }],
      };
      records = await Client.find(cdt);
      if (records && records.length) {
        throw createError(400, 'error.DUPLICATE_CODE');
      }
    }

    if (contractNo) {
      cdt.where = {
        and: [{ id: { neq: id } }, { contractNo }],
      };
      records = await Client.find(cdt);
      if (records && records.length) {
        throw createError(400, 'error.DUPLICATE_CONTRACT_NO');
      }
    }

    if (taxNo) {
      cdt.where = {
        and: [{ id: { neq: id } }, { taxNo }],
      };
      records = await Client.find(cdt);
      if (records && records.length) {
        throw createError(400, 'error.DUPLICATE_TAX_NO');
      }
    }

    if (data.serial) {
      // update to client meter
      const clientMeter = await Client.app.models.ClientMeter.findOne({ clientId: data.clientId });
      if (clientMeter) {
        clientMeter.updateAttributes({ serial: data.serial });
      }
    }

    // save to client
    let record = await Client.replaceById(id, data);
    return record;
  };

  // check valid MaKH, MaHD, Masothue khi chinh sua hop dong va khach hang
  Client.remoteMethod('editClient', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
    ],
    returns: { arg: 'data', root: 'true', type: 'object' },
    http: { path: '/editClient/:id', verb: 'put' },
  });
};
