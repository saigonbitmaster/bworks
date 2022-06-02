'use strict';
const lodash = require('lodash');

module.exports = AppUser => {
  AppUser.getPathsByRoleAndProject = async (role, project) => {
    let { apiPath, menu = {}, appMenu = {} } = await AppUser.getAccessByRole(project, role);
    const urls = lodash.flatten(
      Object.keys(apiPath || {}).map(url => {
        const methods = lodash.keys(apiPath[url]);
        return methods.map(method => ({ url, method }));
      }),
    );
    return { urls, menu, appMenu };
  };

  AppUser.remoteMethod('getPathsByRoleAndProject', {
    accepts: [
      { arg: 'role', type: 'string' },
      { arg: 'project', type: 'string' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
