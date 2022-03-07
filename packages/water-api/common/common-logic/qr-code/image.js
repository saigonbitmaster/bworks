'use strict';

const Qr = require('qrcode');
const { Transform } = require('stream');

module.exports = async function(Qrcode) {
  Qrcode.image = function(text, width, margin = 2, cb) {
    const inOutStream = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      },
    });
    Qr.toFileStream(inOutStream, text, { width, margin });
    cb(null, inOutStream, 'image/png');
  };

  Qrcode.remoteMethod('image', {
    accepts: [
      { arg: 'text', type: 'string', required: true },
      { arg: 'width', type: 'number', required: false },
      { arg: 'margin', type: 'number', required: false },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      // { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
