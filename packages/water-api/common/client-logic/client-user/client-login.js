'use strict';

module.exports = ClientUser => {
  ClientUser.afterRemote('login', (context, remoteMethodOutput, next) => {
    //...
    if (remoteMethodOutput && remoteMethodOutput.userId) {
      ClientUser.findById(remoteMethodOutput.userId)
        .then(user => {
          const { name, username, settings } = user;
          remoteMethodOutput.info = { name, username, settings };
          next();
        })
        .catch(error => {
          next(error);
        });
    } else {
      next();
    }
  });
};
