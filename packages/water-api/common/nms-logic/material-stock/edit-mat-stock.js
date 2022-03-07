const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialstock) {
  Materialstock.editMatStock = async (id, { data }, options) => {
    if (!id || !data) {
      throw createError(400, 'error.DATA_INVALID');
    }

    let record = await Materialstock.findById(id);
    if (!record) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }

    // check valid
    let { initValue, exportValue } = data;
    if (initValue < exportValue) {
      throw createError(400, 'error.INIT_VALUE_LESS_EXPORT_VALUE_STOCK');
    }
    delete data.exportValue;
    const fullData = await operationMeta({ data, options, isNew: false });
    return record.updateAttributes(fullData);
  };
  Materialstock.remoteMethod('editMatStock', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
    http: { path: '/editMatStock/:id', verb: 'put' },
  });
};
