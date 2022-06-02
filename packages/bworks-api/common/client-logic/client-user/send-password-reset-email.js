'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const createError = require('http-errors');
const {
  email: { email: SENDER_EMAIL, password: SENDER_PASSWORD },
  frontendURL,
} = require('../../../server/config.json');
const templateGenerator = require('./template.js');

// eslint-disable-next-line no-unused-vars
module.exports = ClientUser => {
  ClientUser.resetUserPassword = async (credential, req) => {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: SENDER_EMAIL,
          pass: SENDER_PASSWORD,
        },
      }),
    );

    let username = null;
    let email = null;

    // Validate inputs
    if (credential.includes('@')) {
      if (!credential.match(/^\w+@(?:[a-z]+\.)+[a-z]+$/)) {
        throw createError(400, 'error.INVALID_EMAIL');
      } else {
        email = credential;
      }
    } else {
      if (!credential.match(/^\w+$/)) {
        throw createError(400, 'error.INVALID_USERNAME');
      } else {
        username = credential;
      }
    }

    // Validate the email was used to register the account
    const matched = await ClientUser.findOne({ where: { or: [{ username }, { email }] } });
    if (!matched) {
      throw createError(400, 'error.USER_NOT_FOUND');
    } else {
      if (!matched.email) {
        throw createError(400, 'error.DEFAULT_CREATED_ACCOUNT_SO_NO_EMAIL');
      }
    }

    // Get customized TTL value or the default 15 minutes
    const ttl = ClientUser.settings.resetPasswordTokenTTL || 15 * 60;
    // Create options for creating short-lived access token
    const option = { scopes: ['reset-password'] };
    // Generate a short-lived token
    const accessToken = await matched.createAccessToken(ttl, option);
    let domain = req.get('host');
    // if (!domain.startsWith('localhost')) {
    //   domain += `/${projectKey}`;
    // }
    const isDevelopment = !!(!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
    const url = isDevelopment
      ? `${frontendURL.wctmClient}/#/createNewPassword?accessToken=${accessToken.id}`
      : `${req.protocol}://${domain}/client/createNewPassword?accessToken=${accessToken.id}`;

    const mailPayload = {
      from: SENDER_EMAIL,
      to: matched.email || email,
      subject: 'Thay đổi mật khẩu tài khoản app QLKH',
      html: templateGenerator(matched.username, url),
    };

    const resetPasswordResult2 = await new Promise((resolve, reject) => {
      transporter.sendMail(mailPayload, err => {
        if (err) reject(err);
        resolve('Sent');
      });
    });

    if (typeof resetPasswordResult2 === 'string' && resetPasswordResult2 === 'Sent') {
      return true;
    } else {
      return false;
    }
  };

  ClientUser.remoteMethod('resetUserPassword', {
    accepts: [
      { arg: 'credential', type: 'string', required: true },
      // { arg: 'returnUrl', type: 'string' },
      { arg: 'req', type: 'object', http: { source: 'req' } },
    ],
    http: { verb: 'post' },
    returns: { arg: 'result', type: 'boolean', root: true },
  });
};
