'use strict';
const _ = require('lodash');

module.exports = function(Iotdevice) {
  /// update device state
  Iotdevice.beforeRemote('updateState', Iotdevice.verify);
  Iotdevice.updateState = async (devices, deviceKey) => {
    const iotDevice = await Iotdevice.findById(deviceKey);
    const reported = _.get(iotDevice, 'state.reported', {});
    const currentTime = new Date().valueOf();
    devices.map(({ id, time, ...rest }) => {
      reported[id] = { ...rest, time: currentTime };
    });
    _.set(iotDevice, 'state.reported', reported);
    await iotDevice.save();
    return { id: deviceKey, reported };
  };

  Iotdevice.remoteMethod('updateState', {
    accepts: [
      { arg: 'devices', type: ['object'] },
      { arg: 'x-device-key', type: 'string', http: { source: 'header' } },
      { arg: 'x-device-secret', type: 'string', http: { source: 'header' } },
    ],
    http: { verb: 'post' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
