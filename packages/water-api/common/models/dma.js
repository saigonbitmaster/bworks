'use strict';
const get = require('lodash/get');
const hook = require('../logic/dma/hook');
module.exports = function(Dma) {
  // split file
  hook(Dma);

  Dma.beforeRemote('find', function(ctx, user, next) {
    try {
      let or = get(ctx, 'args.filter.where.or');
      if (or && or.length === 0) {
        delete ctx.args.filter.where.or;
      }
    } catch (err) {
            console.log(err); // eslint-disable-line
    }

    next();
  });
};
