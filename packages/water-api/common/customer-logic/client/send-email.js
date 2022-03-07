'use strict';
const mapLimit = require('util').promisify(require('async/mapLimit'));
const get = require('lodash/get');
const compact = require('lodash/compact');
const nodemailer = require('nodemailer');

module.exports = Client => {
  Client.sendEmail = async chunked => {
    // Setup config for Nodemailer to communicate with dedicated mail server
    const transporter = nodemailer.createTransport({
      host: 'mail.Bworks.online',
      port: 25,
      secure: false,
      pool: true,
      maxMessages: Infinity,
      maxConnections: 20,
      rateLimit: 1,
      connectionTimeout: 500, // 1 second to check the mailserver
    });

    // Try to communicate with the mail server and ask it to send forward a mail
    const sentEmailResults = await mapLimit(chunked, 5, async message => {
      const mailData = {
        from: '"Bworks" <no-reply@mail.Bworks.online>',
        to: get(message, 'meta.to', 'dotronghai96@gmail.com'),
        subject: get(message, 'data.subject', 'Hello'),
        text: get(message, 'data.text', "Hello man. How's it going?"),
      };
      try {
        const sentEmail = await transporter.sendMail(mailData);
        return { sentEmail, originalMessage: message };
      } catch (err) {
        return null;
      }
    });

    return compact(sentEmailResults);
  };

  Client.remoteMethod('sendMail', {
    http: { verb: 'get' },
  });
};
