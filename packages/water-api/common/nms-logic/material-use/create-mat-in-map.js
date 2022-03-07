const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const loopback = require('loopback');
module.exports = function(Materialuse) {
  Materialuse.createMatInMap = async (data, options) => {
    if (!data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let { type, exportId, length, fromNodeId } = data;

    // tim vat tu xuat kho
    let instExport = await Materialuse.app.models.MaterialExport.findById(exportId);
    if (!instExport) {
      throw createError(400, 'error.DO_NOT_FIND_MAT_EXPORT');
    }

    let tmp;
    if (type === 'Pipe') {
      tmp = instExport.currentValue - length;
    } else {
      // vat tu khac
      tmp = instExport.currentValue - 1;
    }
    tmp = tmp < 0 ? 0 : tmp;
    instExport.currentValue = tmp;

    // update so luong
    const fullDataExport = await operationMeta({ data: instExport, options, isNew: false });
    instExport.updateAttributes(fullDataExport);

    // insert
    let node = await Materialuse.app.models.Node.findById(fromNodeId);
    if (node) {
      data.node = loopback.GeoPoint({ lat: node.position.lat, lng: node.position.lng });
    }

    delete data.currentValue;

    const fullDataUse = await operationMeta({ data, options, isNew: true });
    let record = await Materialuse.create(fullDataUse);
    return record;
  };
  Materialuse.remoteMethod('createMatInMap', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
