'use strict';
// const get = require('lodash/get');
// eslint-disable-next-line no-unused-vars
module.exports = function(Appuser) {
  // App
  Appuser.afterRemote('login', function(context, remoteMethodOutput, next) {
    //...
    if (remoteMethodOutput && remoteMethodOutput.user) {
      remoteMethodOutput.user((err, data) => {
        if (err) next(err);
        const { id, fullName, email, username, thumnail = '' } = data;
        remoteMethodOutput.info = { id, fullName, email, username, thumnail };
        next();
      });
    } else {
      next();
    }
  });
};
