const createError = require('http-errors');
module.exports = function(Materialexport) {
  Materialexport.customDelete = async function(ids) {
    try {
      let count = 0;
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        // check: material is used in MaterialUse ?
        let matUses = await Materialexport.app.models.MaterialUse.find({ where: { exportId: id } });
        if (matUses && matUses.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_MAT_EXPORT_USING');
        }
      }
      // ok => delete
      count = await Materialexport.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Materialexport.remoteMethod('customDelete', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
