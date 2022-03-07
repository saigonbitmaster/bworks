const { get } = require('lodash');
const moment = require('moment-timezone');

module.exports = function(Meternumbersubmit) {
  Meternumbersubmit.checkIfHavePrivilegeSubmit = async (clientId = null, options) => {
    if (!clientId) {
      const userId = get(options, 'accessToken.userId');
      const currentUser = await Meternumbersubmit.app.models.ClientUser.findById(userId);
      clientId = currentUser.clientId;
    }
    const clientMeterNumberId = `${clientId.toString()}-${moment().format('YYYY-MM')}`;
    const record = await Meternumbersubmit.app.models.ClientMeterNumber.findById(clientMeterNumberId);
    return !record;
  };

  Meternumbersubmit.remoteMethod('checkIfHavePrivilegeSubmit', {
    accepts: [
      { arg: 'clientId', type: 'string' },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    http: { verb: 'get' },
    returns: { arg: 'isHave', type: 'boolean', root: true },
  });
};
