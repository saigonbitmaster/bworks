'use strict';
const { getConnectorFromModel } = require('../../utils/transaction-utils');
const Transaction = require('../../utils/transaction');
const toObjectId = require('../../utils/to-object-id');

module.exports = ClientUser => {
  // Approve client's request to create accounts
  ClientUser.approveNewRequest = async id => {
    const transaction = new Transaction(ClientUser);
    const session = transaction.start();
    try {
      const clientUserModel = getConnectorFromModel(ClientUser);
      const roleMappingModel = getConnectorFromModel(ClientUser, 'RoleMapping');

      // Change the approval flag to true
      await clientUserModel.updateOne({ _id: toObjectId(id) }, { $set: { approved: true } }, { session });

      // Grant RoleMapping to successfully access APIs in wctm-client
      const roleMapping = {
        principalType: 'USER',
        principalId: id,
        roleId: toObjectId('1a1a1a1a1a1a1a1a1a1a1001'),
      };
      await roleMappingModel.insertOne(roleMapping, { session });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
    }
  };
  ClientUser.remoteMethod('approveNewRequest', {
    accepts: { arg: 'id', type: 'string', required: true },
    http: { verb: 'post' },
  });
};
