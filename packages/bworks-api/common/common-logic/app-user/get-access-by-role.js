'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = function(AppUser) {
  AppUser.getAccessByRole = async (project, roleName) => {
    return AppUser.rolesToPaths(project, [roleName]);
  };

  AppUser.remoteMethod('getAccessByRole', {
    accepts: [
      { arg: 'project', type: 'string', required: true },
      { arg: 'roleName', type: 'string', required: true },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
