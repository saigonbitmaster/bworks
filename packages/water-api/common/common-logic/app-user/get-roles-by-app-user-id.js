'use strict';

module.exports = AppUser => {
  AppUser.getRolesByAppUserId = async id => {
    const Role = AppUser.app.models.Role;
    const RoleMapping = AppUser.app.models.RoleMapping;

    const checkedRoleMappings = await RoleMapping.find({ where: { principalId: id } });

    if (checkedRoleMappings.length > 0) {
      const roleIds = checkedRoleMappings.map(checkedRoleMapping => checkedRoleMapping.roleId);
      const checkedRoles = await Role.find({ where: { _id: { inq: roleIds } } });
      if (checkedRoles.length > 0) {
        return checkedRoles;
      }
    }

    return null;
  };

  AppUser.remoteMethod('getRolesByAppUserId', {
    accepts: { arg: 'id', type: 'string' },
    http: { verb: 'get' },
    returns: { arg: 'roles', type: 'string' },
  });
};
