'use strict';
const createError = require('http-errors');
// active = true: id cong ty
// active = false: cac tong ty != id
module.exports = function(CtmCompany) {
  CtmCompany.doActive = async filter => {
    // console.log('doActive', filter);
    try {
      let { id } = filter.where;
      if (!id) {
        return { count: 0 };
      }
      let res = await CtmCompany.findById(id);
      if (!res) {
        throw createError(400, 'error.CTMCOMPANY_DATA_NOT_EXIST');
      }
      // update me
      res = await CtmCompany.updateAll(
        { id },
        {
          active: true,
        },
      );
      if (res.count === 1) {
        // change other records: [active] = false
        await CtmCompany.updateAll(
          { id: { neq: id } },
          {
            active: false,
          },
        );
        return { count: 1 };
      } else {
        return { count: 0 };
      }
    } catch (error) {
      throw createError(400, 'error.CTMCOMPANY_ERROR_ACTIVE');
    }
  };
  CtmCompany.remoteMethod('doActive', {
    accepts: { arg: 'filter', type: 'object' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
