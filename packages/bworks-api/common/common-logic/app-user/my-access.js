'use strict';
const get = require('lodash/get');
const createError = require('http-errors');
// eslint-disable-next-line no-unused-vars
module.exports = function(Appuser) {
  
  Appuser.myAccess = async (project, options) => {
    let userId = get(options, 'accessToken.userId');
    let type = 'employee';
    if (!userId) {
      // return {};
      throw createError(400, 'error.WRONG_USER');
    }
    const roles = await Appuser.userRoles(project, userId);
    let roleNames = roles.map(item => item.name);
    let user = await Appuser.findById(userId);
    if (user && user.username === 'master') {
      // hard code check master
      type = 'master';
    }
    let data = await Appuser.rolesToPaths(project, roleNames, Appuser.app.aclsDefinition.acls);
    return { ...data, type };
  };

  Appuser.remoteMethod('myAccess', {
    accepts: [
      { arg: 'project', type: 'string', required: true },
      { arg: 'options', type: 'object', http: 'optionsFromRequest' },
    ],
    returns: { arg: 'data', type: 'object', root: true },
  });
};
