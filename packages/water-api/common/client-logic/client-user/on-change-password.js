const get = require('lodash/get');
const { getConnectorFromModel } = require('../../utils/transaction-utils');

module.exports = function(ClientUser) {
  ClientUser.afterRemote('changePassword', function(ctx, _, next) {
    // Delete visible field of default password
    const clientUserId = get(ctx, 'args.id', null);
    if (clientUserId) {
      const rawClientUserModel = getConnectorFromModel(ClientUser);
      rawClientUserModel.updateOne({ _id: clientUserId }, { $unset: { defaultPassword: '' } }, {}, error => {
        if (error) next(error);
        else next();
      });
    }
  });
};
