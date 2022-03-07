const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialexport) {
  Materialexport.returnMatForStock = async (id, { data }, options) => {
    if (!id || !data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let { exportValue, returnValue, currentValue } = data;
    if (returnValue > currentValue) {
      throw createError(400, 'error.NUMBER_RETURN_LESS_CURRENT_RETURN_STOCK');
    } else if (returnValue === currentValue) {
      // neu gia tri hoan kho = gia tri hien tai => xoa ?
    }

    let record = await Materialexport.findOne({ where: { id } });
    if (!record) {
      throw createError(400, 'error.DATA_NOT_EXIST');
    }

    data.exportValue = exportValue - returnValue;
    data.currentValue = currentValue - returnValue;

    const fullData = await operationMeta({ data, options, isNew: false });
    return record.updateAttributes(fullData);
  };
  Materialexport.remoteMethod('returnMatForStock', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
    http: { path: '/returnMatForStock/:id', verb: 'put' },
  });
};
