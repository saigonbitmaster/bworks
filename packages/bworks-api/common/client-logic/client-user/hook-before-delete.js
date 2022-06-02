'use strict';
const has = require('lodash/has');
const httpError = require('http-errors');

module.exports = ClientUser => {
  ClientUser.observe('before delete', function(ctx, next) {
    // Remove the RoleMapping assigned to deleted client user
    if (has(ctx, 'where.id.inq')) {
      const idsToBeDeleted = ctx.where.id.inq.map(id => id.toString());
      if (idsToBeDeleted.includes('1a1a1a1a1a1a1a1a1a1a1a1g')) {
        return next(new httpError(400, 'error.CAN_NOT_DELETE_DATA'));
      }
      ctx.Model.app.models.RoleMapping.destroyAll({ principalId: { inq: idsToBeDeleted } }, err => {
        if (err) next(err);
        else {
          next();
        }
      });
    } else {
      next();
    }
  });
};
