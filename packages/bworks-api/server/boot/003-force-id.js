'use strict';
module.exports = async app => {
  removeForceId(app.models.Role);
  removeForceId(app.models.ACL);
  removeForceId(app.models.RoleMapping);
};

const removeForceId = model => {
  model.settings.forceId = false;
  model.validations.id = model.validations.id.filter(
    item => item.validation !== 'absence' && item.if !== 'isNewRecord',
  );
};
