'use strict';
const omit = require('lodash/omit');

module.exports = AppUser => {
  AppUser.saveAppUser = async data => {
    const RoleMapping = AppUser.app.models.RoleMapping;

    // Update edited content to properties
    const roles = data.roles;
    const appUserId = await AppUser.upsert(omit(data, 'roles')).then(updatedModel => updatedModel.id.toString());

    // Remove role mappings associated with former app user ID
    await RoleMapping.destroyAll({ principalId: appUserId });

    // Install new role mappings
    const newRoleMappings = roles.map(role => ({
      principalType: 'USER',
      principalId: appUserId,
      roleId: role,
    }));
    await RoleMapping.create(newRoleMappings);
  };

  AppUser.remoteMethod('saveAppUser', {
    accepts: { arg: 'data', type: 'object' },
    http: { verb: 'post' },
  });
};
