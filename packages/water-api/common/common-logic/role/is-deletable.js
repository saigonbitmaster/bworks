'use strict';
const defaultRoles = require('../../../server/init-data/Role');

module.exports = Role => {
  Role.isDeletable = async id => {
    // Prevent deletion of default, undeletable roles
    const stringifiedRoleId = id.toString();
    const defaultRoleIds = defaultRoles.map(role => role.id);
    if (defaultRoleIds.includes(stringifiedRoleId)) {
      return false;
    }

    // Prevent deletion of roles being assigned to app users at the time of deletion
    const RoleMapping = Role.app.models.RoleMapping;
    const AppUser = Role.app.models.AppUser;
    const checkedRole = await RoleMapping.findOne({ where: { roleId: id } });
    if (checkedRole) {
      const checkedRolePrincipalId = checkedRole.toJSON().principalId;
      const checkedAppUser = await AppUser.findById(checkedRolePrincipalId);
      if (checkedAppUser) {
        return false;
      }
    }
    return true;
  };

  Role.remoteMethod('isDeletable', {
    accepts: { arg: 'id', type: 'string' },
    http: { verb: 'get' },
    returns: { arg: 'result', type: 'boolean' },
  });
};
