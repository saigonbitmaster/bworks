'use strict';

let regexEscape = function(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = function(Model) {
  Model.observe('access', (ctx, next) => {
    if (ctx.query) {
      if (!ctx.query.where) ctx.query.where = {};
      if (ctx.query.where.isDeleted === undefined) {
        ctx.query.where.isDeleted = { neq: true };
      }

      if (ctx.query.where.q) {
        let q = new RegExp(regexEscape(ctx.query.where.q), 'i');
        delete ctx.query.where.q;
        let orCondition = [];

        ctx.Model.forEachProperty((name, prop) => {
          if (prop.type === String || Array.isArray(prop.type) || prop.type === Array) {
            let c = {};
            c[name] = q;
            orCondition.push(c);
          }
        });

        ctx.query.where['or'] = orCondition;
      }
    }
    next();
  });
};
