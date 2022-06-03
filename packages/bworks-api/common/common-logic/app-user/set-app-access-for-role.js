'use strict';
const createError = require('http-errors');
const createSwaggerObject = require('loopback-swagger').generateSwaggerSpec;
const roleOperationToProperty = require('../../utils/role-operation-to-property');

// eslint-disable-next-line no-unused-vars
module.exports = function(AppUser) {
  // toannt 2021/03/24, hot fix override web permissions
  AppUser.setAppAccessForRole = async (project, roleName, matrix, menu) => {
    const app = AppUser.app;
    let fixRoleName = `${project}-${roleName}`;
    // verify current role
    let role = await app.models.Role.findOne({ where: { name: fixRoleName } });
    if (!role || role.name.length < 3) {
      throw createError(400, 'error.ROLE_NOT_FOUND');
    }
    const acls = buildACls(fixRoleName, matrix);

    for (const acl of acls) {
      const { model, property, principalId, principalType } = acl;
      const record = await app.models.ACL.find({ where: { model, property, principalId, principalType } });
      if (record.length > 0) {
        let i = 1;
        while (i < record.length) {
          await record[1].destroy();
          i += 1;
        }
        acl.isApp = true;
        await record[0].updateAttributes(acl);
      } else {
        await app.models.ACL.create(acl);
      }
    }
    // await app.models.ACL.create(acls);
    // update record role
    role.appMenu = menu;
    await role.save();
    return acls.length;
  };

  const buildACls = (fixRoleName, matrix) => {
    const swaggerObject = createSwaggerObject(AppUser.app, {});
    const acls = [];
    const urlMaping = {};
    Object.keys(swaggerObject.paths).map(url => {
      urlMaping[url.toLowerCase()] = url;
    });
    matrix.map(({ url, method, accessType = '*' }) => {
      let fixUrl = url.toLowerCase();
      let urlMap = urlMaping[fixUrl];
      // url
      const baseUrlObj = swaggerObject.paths[urlMap];
      if (!baseUrlObj) {
        throw createError(400, 'error.MATRIX_URL_NOT_FOUND', { url });
      }
      // method
      const methodObj = baseUrlObj[method];
      if (!methodObj) {
        throw createError(400, 'error.MATRIX_METHOD_NOT_FOUND', { url, method });
      }
      let modelName = methodObj.tags[0];
      let operation = methodObj.operationId.substring(modelName.length + 1);
      operation = roleOperationToProperty(modelName, method, operation);
      operation = operation.indexOf('prototype.') == 0 ? operation.substring(10) : operation;
      acls.push({
        model: modelName,
        property: operation,
        accessType: accessType,
        permission: 'ALLOW',
        principalType: 'ROLE',
        principalId: fixRoleName,
      });
    });

    return acls;
  };
  AppUser.remoteMethod('setAppAccessForRole', {
    accepts: [
      { arg: 'project', type: 'string', required: true },
      { arg: 'roleName', type: 'string', required: true },
      { arg: 'matrix', type: ['object'], required: true },
      { arg: 'menu', type: 'object', require: true },
    ],
    http: { verb: 'post' },
    returns: { arg: 'count', type: 'number' },
  });
};
