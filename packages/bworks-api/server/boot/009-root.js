'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', (data, res) => {
    res.redirect('/cmn'); // redirect to common login page
  });
  router.get('/status', server.loopback.status());
  server.use(router);
};
