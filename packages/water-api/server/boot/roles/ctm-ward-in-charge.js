'use strict';
const get = require('lodash/get');
const createError = require('http-errors');

module.exports = app => {
  var Role = app.models.Role;

  const listMethod = {
    writeNewMonth: true,
    updateMonth: true,
  };

  Role.registerResolver('$ctm-ward-in-charge', function(role, context, cb) {
    // Q: Is the current request accessing a Project?
    if (context.modelName !== 'ClientMeterNumber' || !listMethod[context.method]) {
      // A: No. This role is only for projects: callback with FALSE
      return process.nextTick(() => cb(null, false));
    }

    //Q: Is the user logged in? (there will be an accessToken with an ID if so)
    var userId = context.accessToken.userId;
    if (!userId) {
      //A: No, user is NOT logged in: callback with FALSE
      return process.nextTick(() => cb(null, false));
    }
    let userModel = context.accessToken.user._targetClass;

    // get data request
    let clientId = get(context, 'remotingContext.req.body.data.clientId');
    if (!clientId) {
      return process.nextTick(() => cb(null, false));
    }

    app.models.Client.findById(clientId, function(err, client) {
      if (err) return cb(err);
      if (!client) return cb(createError(400, 'error.CLIENT_NOT_FOUND'));
      if (!client.wardId) {
        return process.nextTick(() => cb(createError(400, 'error.CLIENT_WARD_NOT_FOUND')));
      }
      // wardInChargeIds
      app.models[userModel].findById(userId, function(err, user) {
        if (err) return cb(err);
        if (user && user.wardInChargeIds && user.wardInChargeIds.length) {
          let check = user.wardInChargeIds.some(wardId => wardId.toString() === client.wardId.toString());
          return process.nextTick(() => cb(null, check));
        }
        return process.nextTick(() => cb(null, false));
      });
    });
  });
};
