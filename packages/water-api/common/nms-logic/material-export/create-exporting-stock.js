const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialdetailtype) {
  Materialdetailtype.createExportingStock = async (data, options) => {
    if (!data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    // khi xuat kho(tao moi), thi xoa field 'remainValueStock'
    delete data.remainValueStock;

    //
    data.currentValue = data.exportValue;

    const fullData = await operationMeta({ data, options, isNew: true });
    let record = await Materialdetailtype.create(fullData);
    return record;
  };
  Materialdetailtype.remoteMethod('createExportingStock', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
