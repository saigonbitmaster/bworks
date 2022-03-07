'use strict';

module.exports = ClientUser => {
  const oldLogin = ClientUser.login;

  ClientUser.login = (credentials, include, fn) => {
    if (typeof include === 'function') {
      fn = include;
      include = undefined;
    }
    const { username = '', email = '' } = credentials;
    const query = { where: {} };
    if (email) query.where.email = email;
    if (username) query.where.username = username;
    ClientUser.findOne(query, (err, user) => {
      if (err) fn({ statusCode: 401, message: 'LOGIN_FAILED' });
      if (user && (user.createdByAdmin || user.approved)) {
        // Allow login
        oldLogin.bind(ClientUser)(credentials, include, fn);
      } else {
        // Prevent created user without approval to login
        fn({ statusCode: 400, message: 'NOT_APPROVED' });
      }
    });
  };

  ClientUser.remoteMethod('login', {
    description: 'Login a user with username/email and password.',
    accepts: [
      { arg: 'credentials', type: 'object', required: true, http: { source: 'body' } },
      {
        arg: 'include',
        type: ['string'],
        http: { source: 'query' },
      },
    ],
    returns: {
      arg: 'accessToken',
      type: 'object',
      root: true,
    },
    http: { verb: 'post' },
  });
};
