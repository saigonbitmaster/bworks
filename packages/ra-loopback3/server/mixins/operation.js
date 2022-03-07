'use strict';
const get = require('lodash/get');
const extend = require('extend');
const server = require('../server');
// eslint-disable-next-line no-unused-vars
module.exports = function(Model, options) {
  let app = server.getApp();
  Model.defineProperty('createdDate', {
    type: 'date',
    index: true,
    require: true,
  });
  Model.defineProperty('updatedDate', {
    type: 'date',
    index: true,
    require: true,
  });

  Model.defineProperty('creatorId', {
    type: 'object',
    index: true,
    require: true,
  });

  Model.defineProperty('updaterId', {
    type: 'object',
    index: true,
    require: true,
  });

  Model.belongsTo('AppUser', { as: 'creator' });
  Model.belongsTo('AppUser', { as: 'updater' });
  Model.createOptionsFromRemotingContext = function(ctx) {
    var base = this.base.createOptionsFromRemotingContext(ctx);
    return extend(base, {
      currentUserId: base.accessToken && base.accessToken.userId,
    });
  };
  Model.beforeRemote('saveOptions', function(ctx, unused, next) {
    if (!ctx.args.options.accessToken) return next();
    Model.app.models.AppUser.findById(ctx.args.options.accessToken.userId, function(err, user) {
      if (err) return next(err);
      ctx.args.options.currentUser = user;
      next();
    });
  });
  // override in base model instead
  Model.observe('before save', (ctx, next) => {
    const direct = !!get(ctx, 'options.accessToken.userId');
    if (direct) {
      let data = ctx.instance || ctx.data;
      let curentDate = new Date();
      const userId = direct ? get(ctx, 'options.accessToken.userId') : app.dataConfig.systemId;
      if (ctx.isNewInstance) {
        // default method case
        if (!data.creatorId) {
          data.creatorId = userId;
          data.createdDate = curentDate;
        }
        if (!data.updaterId) {
          data.updaterId = userId;
          data.updatedDate = curentDate;
        }
      } else {
        // creator
        if (!data.creatorId) {
          data.creatorId = userId;
          data.createdDate = curentDate;
        }
        // updater
        if (!data.updaterId) {
          data.updaterId = userId;
          data.updatedDate = curentDate;
        }
      }
    }

    next();
  });
};
