'use strict';
const QRCode = require('qrcode');
// eslint-disable-next-line no-unused-vars
module.exports = function(Icon) {
  const options = {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    quality: 0.1,
    margin: 1,
    // color: {
    //   dark: '#000000',
    //   light: '#FFFFFF',
    // },
  };

  Icon.qr = async (text, width = 100, type = 'stream', res) => {
    const ops = { ...options, width };
    if (type === 'base64') {
      const content = await QRCode.toDataURL(text, ops);
      res.send(content);
    } else {
      // res.setHeader('content-type', 'image/png');
      res.set('Content-Type', 'image/png');
      const buf = await QRCode.toBuffer(text, ops);
      res.send(buf);
    }
  };
  Icon.remoteMethod('qr', {
    accepts: [
      { arg: 'text', type: 'string', required: true },
      { arg: 'width', type: 'number', default: 100 },
      { arg: 'type', type: 'string', default: 'base64' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  });
};
