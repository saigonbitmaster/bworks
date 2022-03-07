const has = require('lodash/has');

module.exports = async app => {
  const filteredModels = ['ClientRegister', 'Client'];
  Object.keys(app.models)
    .filter(model => filteredModels.includes(model))
    .map(modelName => {
      const filteredModel = app.models[modelName];
      if (filteredModel) {
        filteredModel.beforeRemote('find', async ctx => {
          if (!has(ctx, 'req.accessToken')) {
            return Promise.reject('Invalid user');
          }
          const user = await ctx.req.accessToken.user.get();
          if (!user) {
            return Promise.reject('Invalid user');
          }
          const wardInChargeIds = user.wardInChargeIds;
          const quarterInChargeIds = user.quarterInChargeIds;

          // Find related geo model
          let newCondition = ctx.args.filter && ctx.args.filter.where ? ctx.args.filter.where : {};

          if (quarterInChargeIds && quarterInChargeIds.length > 0) {
            if (has(newCondition, 'and')) {
              newCondition.and.unshift({ quarterId: { inq: quarterInChargeIds } });
            } else {
              newCondition = { and: [{ quarterId: { inq: quarterInChargeIds } }, newCondition] };
            }
          } else if (wardInChargeIds && wardInChargeIds.length > 0) {
            if (has(newCondition, 'and')) {
              newCondition.and[0] = { wardId: { inq: wardInChargeIds } };
            } else {
              newCondition = { and: [{ wardId: { inq: wardInChargeIds } }, newCondition] };
            }
          }

          if (ctx.args.filter && ctx.args.filter.where) {
            ctx.args.filter.where = newCondition;
          } else {
            ctx.args.filter = { where: newCondition };
          }
          return;
        });
      }
    });
};
