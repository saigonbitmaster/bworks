'use strict';
const get = require('lodash/get');
const createSwaggerObject = require('loopback-swagger').generateSwaggerSpec;
const has = require('lodash/has');
const roleOperationToProperty = require('../../utils/role-operation-to-property');

// eslint-disable-next-line no-unused-vars
module.exports = function(AppUser) {
  AppUser.rolesToPaths = async (project, roleNames, extAcls = []) => {
    const fixRoleNames = roleNames.map(item =>
      item.indexOf(`${project}-`) == 0 || item.indexOf('$') === 0 ? item : `${project}-${item}`,
    );
    const app = AppUser.app;
    let apiPath = {};
    let menu = {};
    let appMenu = {};
    var swaggerObject = createSwaggerObject(app, {});
    let acls = await app.models.ACL.find({ where: { principalId: { inq: fixRoleNames } } });
    acls = acls.concat(extAcls);
    if (!acls || acls.length === 0) {
      return {}; // empty
    }
    let pathKeys = Object.keys(swaggerObject.paths);
    pathKeys.map(pathKey => {
      let accessPath = checkPath(swaggerObject, pathKey, acls);
      if (accessPath) {
        apiPath[pathKey] = accessPath;
      }
    });

    let masterMenuConfig = await app.models.PackageConfig.findById(project);
    masterMenuConfig = masterMenuConfig || { id: project, data: {} };

    let activeRoles = await app.models.Role.find({ where: { name: { inq: fixRoleNames } } });
    activeRoles.map(role => {
      let menuKeys = Object.keys(role.menu || {});
      const appMenyKeys = Object.keys(role.appMenu || {});
      menuKeys.map(menuKey => {
        if (has(role.menu, menuKey) && get(masterMenuConfig, `data.${menuKey}`)) {
          menu[menuKey] = get(role.menu, menuKey);
        }
      });
      appMenyKeys.map(menuKey => {
        if (has(role.appMenu, menuKey)) {
          appMenu[menuKey] = get(role.appMenu, menuKey);
        }
      });
    });
    return { apiPath, menu, appMenu };
  };

  const checkPath = (swaggerObject, pathKey, acls) => {
    let pathObject = swaggerObject.paths[pathKey];
    // check method
    let result = null;
    let methodKeys = Object.keys(pathObject);

    methodKeys.map(methodKey => {
      let methodObj = pathObject[methodKey];
      // loop acls
      let modelName = methodObj.tags[0];
      let operation = methodObj.operationId.substring(modelName.length + 1);
      operation = operation.indexOf('prototype.') == 0 ? operation.substring(10) : operation;
      operation = roleOperationToProperty(modelName, methodKey, operation);
      let check = acls.filter(
        ({ model, property }) => (model === '*' || model === modelName) && (property === '*' || property === operation),
      );
      const ableSet = check.some(({ model, property }) => model != '*' && property != '*');
      if (check.length > 0) {
        result = result || {};
        result[methodKey] = {
          ableSet,
          model: modelName,
          method: methodKey,
          params: methodObj.parameters.map(item => ({
            name: item.name,
          })),
        };
      }
    });
    return result;
    
  };
};
