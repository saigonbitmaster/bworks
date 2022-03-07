const createError = require('http-errors');
const operationMeta = require('ra-loopback3/server/utils/operation-meta');
const loopback = require('loopback');
module.exports = function(Factory) {
  Factory.editFactory = async (id, { data }, options) => {
    if (!id || !data) {
      throw createError(400, 'error.DATA_INVALID');
    }
    let f = await await Factory.findById(id);
    if (!f) {
      throw createError(400, 'error.DO_NOT_FIND_FACTORY');
    }

    let { nodeId } = data;
    let node = await Factory.app.models.Node.findById(nodeId);
    if (node) {
      data.position = loopback.GeoPoint({ lat: node.position.lat, lng: node.position.lng });
    }
    delete data.id;
    const fullData = await operationMeta({ data, options, isNew: false });
    let record = await f.updateAttributes(fullData);
    return record;
  };
  Factory.remoteMethod('editFactory', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'data', type: 'object', http: { source: 'body' } },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
    http: { path: '/editFactory/:id', verb: 'put' },
  });
};
