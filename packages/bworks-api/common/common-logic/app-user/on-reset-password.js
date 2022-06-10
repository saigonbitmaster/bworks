'use strict';
module.exports = function(AppUser) {
  AppUser.afterRemote('setPassword', function(ctx, _, next) {
    // Delete used access token
    if (ctx.res.statusCode === 200) {
      AppUser.app.models.AccessToken.deleteById(ctx.req.accessToken.id, err => {
        if (err) next(err);
        else {
        
          next();
        }
      });
    } else {
      next();
    }
  });
};
