const createError = require('http-errors');
module.exports = function(Kml) {
  Kml.deleteKml = async function(ids) {
    if (!ids || !ids.length) {
      throw createError(400, 'error.DATA_INVALID');
    }
    try {
      let count = 0;
      // ok => delete
      count = await Kml.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Kml.remoteMethod('deleteKml', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
