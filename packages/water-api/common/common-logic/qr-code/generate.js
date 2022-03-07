'use strict';
const str = require('string-to-stream');
const { round } = require('lodash');
const Hashids = require('hashids/cjs');
const moment = require('moment-timezone');

const STR_HASH = 'ABCDEFGHJKMNPQRSTUVWXYZ1234567890'; // remove L I O

module.exports = async function(Qrcode) {
  // in seconds from 1970
  const getStartNum = async () => {
    const d20 = new Date(2020, 1, 1).getTime();
    const currentNum = new Date().getTime();
    let result = currentNum > d20 ? currentNum - d20 : d20;
    // in seconds only
    result = round(result / 1000, 0);
    const lastGen = await Qrcode.findOne({ order: 'id DESC' });
    if (lastGen && lastGen.id > result) {
      result = lastGen.id;
    }
    return result;
  };

  const generate = async quantity => {
    const secret = (Qrcode.app.get('secret') || '').toString();
    let startNum = await getStartNum();

    const hashids = new Hashids(secret, 8, STR_HASH);

    let size = quantity < 1 ? 1 : quantity > 50000 ? 50000 : quantity;
    let content = '';
    let i = 0;
    while (i < size) {
      i += 1;
      let text = hashids.encode(startNum + i);
      text = text.substring(0, 4) + '-' + text.substring(4);
      text = text.toUpperCase();
      content += text + '\n';
    }
    await Qrcode.create({ id: startNum + i });
    return { content, size };
  };

  Qrcode.generate = function(quantity, cb) {
    generate(quantity)
      .then(({ content, size }) => {
        let downloadStream = str(content);
        const contentType = 'text/plain';
        const contentDisposition = `attachment; name="QrCodeGeneration"; filename="QR-${size}-${moment().format(
          'L',
        )}.txt"`;
        cb(null, downloadStream, contentType, contentDisposition);
      })
      .catch(cb);
  };

  Qrcode.remoteMethod('generate', {
    accepts: { arg: 'quantity', type: 'number' },
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
