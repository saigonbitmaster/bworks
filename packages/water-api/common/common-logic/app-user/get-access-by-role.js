'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = function(Appuser) {
  Appuser.getAccessByRole = async (project, roleName) => {
    return Appuser.rolesToPaths(project, [roleName]);
  };

  Appuser.remoteMethod('getAccessByRole', {
    accepts: [
      { arg: 'project', type: 'string', required: true },
      { arg: 'roleName', type: 'string', required: true },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
