const get = require('lodash/get');
const objectHash = require('object-hash');
const httpError = require('http-errors');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const {
  email: { email: SENDER_EMAIL, password: SENDER_PASSWORD },
} = require('../../../server/config.json');
const templateGenerator = require('./template.js');

module.exports = ClientUser => {
  
  ClientUser.requestToCreateNewAccount = async (username, email, req) => {
    const code = username;
    const client = await ClientUser.app.models.Client.findOne({
      where: { code },
      fields: { email: true, id: true, name: true },
    });
    if (client) {
      const clientUser = await ClientUser.findOne({ where: { username: code } });
      if (clientUser) {
        throw httpError(400, 'error.EXISTING_CLIENT_USER');
      } else {
        const dataOnHold = {
          username: code,
          name: client.name,
          email,
          emailVerified: false,
          approved: false,
          clientId: client.id.toString(),
        };
        const fetchedClientEmail = get(client, 'email', null);
        if (fetchedClientEmail) {
          if (fetchedClientEmail === email) {
            dataOnHold.approved = true;
          } else {
            throw httpError(400, 'error.INVALID_EMAIL');
          }
        }

        // Generate a hashed string to be as "signature"
        const requestSignature = objectHash(dataOnHold);

        // Put the data to reserve on Redis, using above signature as key
        const ttl = ClientUser.settings.resetPasswordTokenTTL || 15 * 60;
        await ClientUser.app.models.ClientUserAccountRequest.set(requestSignature, dataOnHold, ttl * 1000);

        // Create an short-lived access token to access the API used for create new account
        const masterClientAccount = await ClientUser.findOne({ where: { id: '1a1a1a1a1a1a1a1a1a1a1a1g' } });
        if (!masterClientAccount) {
          throw httpError(500, 'error.INTERNAL_SERVER_ERROR');
        }
        const option = { scopes: ['setPasswordToNewAccount'] };
        const accessToken = await masterClientAccount.createAccessToken(ttl, option);

        // Send mail to input recipient, along with above signature as "requestToken"
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
        const url = `${req.protocol}://${req.get(
          'host',
        )}/client/#/createNewPasswordForNewAccount?requestToken=${requestSignature}&accessToken=${accessToken.id}`;
        const mailPayload = {
          from: SENDER_EMAIL,
          to: email,
          subject: 'Change your password',
          html: templateGenerator(code, url),
        };

        await new Promise((resolve, reject) => {
          transporter.sendMail(mailPayload, (err, info) => {
            if (err) reject(err);
            resolve(info);
          });
        });

        return 'mailSent';
      }
    } else {
      throw httpError(400, 'error.USER_NOT_FOUND');
    }
  };

  ClientUser.remoteMethod('requestToCreateNewAccount', {
    accepts: [
      { arg: 'username', type: 'string', required: true },
      { arg: 'email', type: 'string', required: true },
      { arg: 'req', type: 'object', http: { source: 'req' } },
    ],
    http: { verb: 'post' },
    returns: { arg: 'result', type: 'string', root: true },
  });
};
