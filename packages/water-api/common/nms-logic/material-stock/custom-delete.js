const createError = require('http-errors');
module.exports = function(Materialstock) {
  Materialstock.customDelete = async function(ids) {
    try {
      let count = 0;
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        // check: material is used in MaterialUse, MaterialExport ?
        let matExports = await Materialstock.app.models.MaterialExport.find({ where: { stockId: id } });
        if (matExports && matExports.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_MAT_STOCK_USING');
        }
        let matUses = await Materialstock.app.models.MaterialUse.find({ where: { stockId: id } });
        if (matUses && matUses.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_MAT_STOCK_USING');
        }
      }
      // ok => delete
      count = await Materialstock.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Materialstock.remoteMethod('customDelete', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
