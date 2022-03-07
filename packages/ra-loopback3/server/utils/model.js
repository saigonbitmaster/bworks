'use strict';

const regexEscape = function(s) {
  return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
};
let ModelUtil = {};
ModelUtil.qQuery = function(model) {
  model.observe('access', (ctx, next) => {
    if (ctx.query && ctx.query.where && ctx.query.where.q) {
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
    next();
  });
};

ModelUtil.disableAllMethods = function disableAllMethods(model, methodsToExpose) {
  if (model && model.sharedClass) {
    methodsToExpose = methodsToExpose || [];
    let relationMethods = [];
    let hiddenMethods = [];

    try {
      // eslint-disable-next-line
      Object.keys(model.definition.settings.relations).forEach(function(relation) {
        relationMethods.push('create');
        relationMethods.push('upsert');
        relationMethods.push('updateAll');
        relationMethods.push('prototype.updateAttributes');

        relationMethods.push('find');
        relationMethods.push('findById');
        relationMethods.push('findOne');

        relationMethods.push('deleteById');

        relationMethods.push('confirm');
        relationMethods.push('count');
        relationMethods.push('exists');
        relationMethods.push('resetPassword');

        relationMethods.push('prototype.__count__accessTokens');
        relationMethods.push('prototype.__create__accessTokens');
        relationMethods.push('prototype.__delete__accessTokens');
        relationMethods.push('prototype.__destroyById__accessTokens');
        relationMethods.push('prototype.__findById__accessTokens');
        relationMethods.push('prototype.__get__accessTokens');
        relationMethods.push('prototype.__updateById__accessTokens');
      });
    } catch (err) {
      // eslint-disable-next-line
      console.log(err);
    }

    relationMethods.map(function(methodName) {
      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName);
        model.disableRemoteMethodByName(methodName);
      }
    });
  }
};

module.exports = ModelUtil;
