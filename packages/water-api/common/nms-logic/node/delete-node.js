const createError = require('http-errors');
module.exports = function(Node) {
  Node.deleteNode = async function(ids) {
    try {
      let count = 0;
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];

        let cdt = {};
        cdt.where = { or: [{ fromNodeId: id }, { toNodeId: id }] };
        let matUses = await Node.app.models.MaterialUse.find(cdt);
        if (matUses && matUses.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_NODE');
        }

        let fatories = await Node.app.models.Factory.find({ where: { nodeId: id } });
        if (fatories && fatories.length > 0) {
          throw createError(400, 'error.CAN_NOT_DELETE_NODE');
        }
      }
      count = await Node.destroyAll({ id: { inq: ids } });
      return count;
    } catch (e) {
      throw e;
    }
  };
  Node.remoteMethod('deleteNode', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
