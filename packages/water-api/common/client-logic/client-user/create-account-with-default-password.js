'use strict';
const httpError = require('http-errors');
const toObjectId = require('../../utils/to-object-id');

module.exports = ClientUser => {
  ClientUser.createAccountWithDefaultPassword = async (clientIds, defaultPassword) => {
    // Get client data from selected Ids
    const selectedClients = await ClientUser.app.models.Client.find({ where: { id: { inq: clientIds } } });
    if (selectedClients) {
      const defaultClientUsers = selectedClients.map(client => {
        const createdClientUser = {
          username: client.code,
          name: client.name,
          password: defaultPassword,
          defaultPassword,
          emailVerified: false,
          createdByAdmin: true,
          clientId: client.id,
        };
        if (client.email) {
          createdClientUser.email = client.email;
        }
        if (client.email) {
          createdClientUser.email = client.email;
        }
        return createdClientUser;
      });
      const possibleDuplicate = await ClientUser.count({
        clientId: { inq: selectedClients.map(({ id }) => id) },
      });
      if (Number.isInteger(possibleDuplicate) && possibleDuplicate > 0) {
        throw httpError(400, 'error.DUPLICATE_MEMBER');
      }
      const createdClientUsers = await ClientUser.create(defaultClientUsers);
      if (createdClientUsers) {
        // Grant RoleMapping to successfully access APIs in wctm-client
        const roleMappings = createdClientUsers.map(data => ({
          principalType: 'USER',
          principalId: toObjectId(data.id),
          roleId: toObjectId('1a1a1a1a1a1a1a1a1a1a1001'),
        }));
        await ClientUser.app.models.RoleMapping.create(roleMappings);
      }
    }
  };

  ClientUser.remoteMethod('createAccountWithDefaultPassword', {
    http: { verb: 'post' },
    accepts: [
      { arg: 'clientIds', type: ['string'], required: true },
      { arg: 'defaultPassword', type: 'string', required: true },
    ],
  });
};
