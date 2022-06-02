module.exports = function(ClientUser) {
  ClientUser.afterRemote('setPassword', function(ctx, _, next) {
    // Delete used access token
    if (ctx.res.statusCode === 200) {
      ClientUser.app.models.AccessToken.deleteById(ctx.req.accessToken.id, err => {
        if (err) next(err);
        else next();
      });
    } else {
      next();
    }
  });
};
