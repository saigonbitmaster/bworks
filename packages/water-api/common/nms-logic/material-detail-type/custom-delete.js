const createError = require('http-errors');
module.exports = function(Materialdetailtype) {
  Materialdetailtype.customDelete = async function(ids) {
    try {
      let count = 0;
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        // check: type is used in MaterialStock, MaterialUse, MaterialExport ?
        let matStocks = await Materialdetailtype.app.models.MaterialStock.find({ where: { detailTypeId: id } });
        if (matStocks && matStocks.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_MAT_TYPE_USING');
        }
        let matExports = await Materialdetailtype.app.models.MaterialExport.find({ where: { detailTypeId: id } });
        if (matExports && matExports.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_ MAT_TYPE_USING');
        }
        let matUses = await Materialdetailtype.app.models.MaterialUse.find({ where: { detailTypeId: id } });
        if (matUses && matUses.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_MAT_TYPE_USING');
        }
      }
      // ok => delete
      count = await Materialdetailtype.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Materialdetailtype.remoteMethod('customDelete', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
