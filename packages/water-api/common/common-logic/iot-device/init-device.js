'use strict';
// const util = require('util');
const uuidv4 = require('uuid/v4');
// const _ = require('lodash');
// const moment = require('moment-timezone');

module.exports = function(Iotdevice) {
  Iotdevice.generateSecret = () => {
    let secrect = uuidv4() + uuidv4();
    secrect = secrect.replace(/-/g, '').toUpperCase();
    return secrect;
  };
  Iotdevice.initDevice = async (name, type, meta, description) => {
    const secrets = [Iotdevice.generateSecret()];
    const data = { name, type, meta, description, secrets, state: { reported: {} } };
    return Iotdevice.create(data);
  };

  Iotdevice.remoteMethod('initDevice', {
    description: 'Init IoT device',
    accessType: 'WRITE',
    accepts: [
      { arg: 'name', type: 'string', required: true },
      { arg: 'type', type: 'string', required: true },
      { arg: 'meta', type: 'object', required: true },
      { arg: 'description', type: 'string' },
    ],
    http: {
      verb: 'post',
    },
    returns: { arg: 'body', type: 'object', root: true },
  });
};
