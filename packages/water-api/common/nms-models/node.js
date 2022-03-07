'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = function(Node) {
  Node.list = async (center, distance, excludeId) => {
    let condition = {
      where: {
        position: {
          near: center,
          maxDistance: distance,
          unit: 'meters',
        },
      },
    };
    if (excludeId) {
      condition.where.id = { neq: excludeId };
    }
    let result = await Node.find(condition);
    return result;
  };
  Node.remoteMethod('list', {
    accepts: [
      { arg: 'center', type: 'geopoint', default: '' },
      { arg: 'distance', type: 'number', default: 1000 },
      { arg: 'excludeId', type: 'string', default: '' },
    ],
    returns: { root: true, type: ['object'] },
  });

  Node.observe('after save', function filterProperties(ctx, next) {
    if (ctx.instance) {
      // update node for material use
      next();
    }
  });
};
