'use strict';
module.exports = function(Appuser) {
  Appuser.userRoles = async (project, userId) => {
    const app = Appuser.app;
    // get RoleMappings
    const roleMappings = await app.models.RoleMapping.find({ where: { principalId: userId.toString() } });
    const roleIds = roleMappings.map(item => item.roleId);
    // get Roles
    let roles = await app.models.Role.find({ where: { id: { inq: roleIds } } });
    const result = roles.filter(item => item.name.indexOf(`${project}-`) == 0);
    return result;
  };
};
