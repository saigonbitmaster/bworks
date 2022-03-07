'use strict';
// const delay = require('delay');
// const _ = require('lodash');
const httpErrors = require('http-errors');
// const es = require('event-stream');

module.exports = function(Iotdevice) {
  const verify = async ({ req }) => {
    const key = req.headers['x-device-key'] || '';
    const secret = req.headers['x-device-secret'] || '';
    const id = (key || '').toLowerCase();
    const count = await Iotdevice.count({ id, secrets: secret });
    if (count !== 1) {
      throw httpErrors(401, 'Unauthorized');
    }
  };
  Iotdevice.verify = verify;

  // Iotdevice.state =
  // const init = async () => {
  //   await delay(10000);

  //   const data = await Iotdevice.create({
  //     name: 'BN01',
  //     type: 'SCADA',
  //     secrets: ['FC820E664B4C4E48AF9A141370AFE2CFDEF4F808A6E049ABA1FACB1FFB445A63'],
  //   });
  //   console.log(data.__data);
  // };
  // init();
};
