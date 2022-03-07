const ContentRange = function(app, options) {
  var remotes = app.remotes();
  let contentRange = options && options.headerName ? options.headerName : 'content-range';
  // Set ContentRange for all search requests
  var applyContentRange = function(ctx, next) {
    var filter;
    if (ctx.args && ctx.args.filter) {
      filter = ctx.args.filter.where;
    }

    if (!ctx.res._headerSent) {
      this.count(filter, function(err, count) {
        ctx.res.set(contentRange, count);
        next();
      });
    } else {
      next();
    }
  };
  var pattern = options && Array.isArray(options.pattern) ? options.pattern : ['*.find'];

  for (var i = pattern.length - 1; i >= 0; i--) {
    remotes.after(pattern[i], applyContentRange);
  }
};

module.exports = ContentRange;
