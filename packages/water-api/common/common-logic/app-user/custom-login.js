'use strict';

module.exports = AppUser => {
  const oldLogin = AppUser.login;

  AppUser.login = (credentials, include, fn) => {
    if (typeof include === 'function') {
      fn = include;
      include = undefined;
    }
    // Find user with given credentials [DONE]
    const { username = '', email = '' } = credentials;
    const query = { where: {} };
    if (email) query.where.email = email;
    if (username) query.where.username = username;
    AppUser.findOne(query, (err, user) => {
      if (err) fn({ statusCode: 401, code: 'LOGIN_FAILED' });
      if (user && user.isBanned) {
        // Prevent login for whom having the`isBanned` property evaluated to "falsey" value, possibly not exist or of False value [DONE]
        fn({ statusCode: 400, code: 'USER_IS_BANNED' });
      } else {
        // Allow login
        oldLogin.bind(AppUser)(credentials, include, fn);
      }
    });
  };

  AppUser.remoteMethod('login', {
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
