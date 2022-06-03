'use strict';
const get = require('lodash/get');
const debug = require('debug')('bworks-api:boot:acl');

module.exports = app => {
  // add index for relation keys for all models
  const aclsDefinition = { acls: [], role: {} };
  Object.keys(app.models).map(modelKey => {
    const currentModel = app.models[modelKey];
    const acls = get(currentModel, 'definition.settings.acls');
    //console.log(acls);
    if (acls && acls.length) {
      acls.map(acl => {
        if (acl.principalType !== 'ROLE' || acl.permission !== 'ALLOW') return;
        if (acl.principalId.indexOf('$') !== 0) {
          debug('Hard code ACL', modelKey, JSON.stringify(acl));
          return;
        }
        let fixAcl = {
          ...acl,
          model: modelKey,
        };
        if (!aclsDefinition.role[acl.principalId]) {
          aclsDefinition.role[acl.principalId] = [];
        }
        aclsDefinition.role[acl.principalId].push(fixAcl);
        aclsDefinition.acls.push(fixAcl);
      });
    }
  });
  app.aclsDefinition = aclsDefinition;
};
