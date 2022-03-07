const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const loopback = require('loopback');
module.exports = function(Factory) {
  Factory.createFactory = async (data, options) => {
    if (!data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let { nodeId } = data;
    let node = await Factory.app.models.Node.findById(nodeId);
    if (node) {
      data.position = loopback.GeoPoint({ lat: node.position.lat, lng: node.position.lng });
    }
    const fullData = await operationMeta({ data, options, isNew: true });
    let record = await Factory.create(fullData);
    return record;
  };
  Factory.remoteMethod('createFactory', {
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
