'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = function(Basemodel) {
  // Basemodel.createOptionsFromRemotingContext = function(ctx) {
  //   var base = this.base.createOptionsFromRemotingContext(ctx);
  //   base.ctx = ctx.req;
  //   return base;
  // };
  // Basemodel.beforeRemote('saveOptions', function(ctx, unused, next) {
  //   if (!ctx.args.options.accessToken) return next();
  //   User.findById(ctx.args.options.accessToken.userId, function(err, user) {
  //     if (err) return next(err);
  //     ctx.args.options.currentUser = user;
  //     next();
  //   });
  // });
};
