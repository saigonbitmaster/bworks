const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
module.exports = function(Materialuse) {
  Materialuse.editMatInMap = async (id, { data }, options) => {
    if (!id || !data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let { type, exportId, length } = data;

    let instUse = await Materialuse.app.models.MaterialUse.findById(id);
    if (!instUse) {
      throw createError(400, 'error.DO_NOT_FIND_MAT_USE');
    }

    if (type === 'Pipe') {
      let instExport = await Materialuse.app.models.MaterialExport.findById(exportId);
      if (!instExport) {
        throw createError(400, 'error.DO_NOT_FIND_MAT_EXPORT');
      }

      let tmp;
      let oldLength = instUse.length;
      tmp = instExport.currentValue + oldLength - length;
      tmp = tmp < 0 ? 0 : tmp;

      // update so luong
      instExport.currentValue = tmp;
      const fullDataExport = await operationMeta({ data: instExport, options, isNew: false });
      instExport.updateAttributes(fullDataExport);
    }

    if (data.health === 'BAD') {
      let instStock = await Materialuse.app.models.MaterialStock.findById(instUse.stockId);
      if (instStock) {
        // update so luong su dung
        let tmp = 0;
        if (instUse.type === 'Pipe') {
          tmp = instStock.adjustValue + instUse.length;
        } else {
          // vat tu khac
          tmp = instStock.adjustValue + 1;
        }
        await Materialuse.app.models.MaterialStock.updateAll({ id: instUse.stockId }, { adjustValue: tmp });
        // console.log('count', count);
      }
    } else {
      if (instUse.health === 'BAD') {
        let instStock = await Materialuse.app.models.MaterialStock.findById(instUse.stockId);
        if (instStock) {
          // update so luong su dung
          let tmp = 0;
          if (instUse.type === 'Pipe') {
            tmp = instStock.adjustValue - instUse.length;
          } else {
            // vat tu khac
            tmp = instStock.adjustValue - 1;
          }
          await Materialuse.app.models.MaterialStock.updateAll({ id: instUse.stockId }, { adjustValue: tmp });
        }
      }
    }

    delete data.currentValue;
    delete data.id;
    const fullDataUse = await operationMeta({ data, options, isNew: false });
    return instUse.updateAttributes(fullDataUse);
  };
  Materialuse.remoteMethod('editMatInMap', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
    http: { path: '/editMatInMap/:id', verb: 'put' },
  });
};
