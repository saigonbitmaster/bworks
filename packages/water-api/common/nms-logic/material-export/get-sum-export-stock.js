'use strict';
const createError = require('http-errors');
module.exports = function(Materialexport) {
  Materialexport.getSumExportStock = async function(stockId) {
    // console.log(stockId);
    try {
      if (!stockId) {
        throw createError(400, 'error.DATA_INVALID');
      }

      let tmp = {};
      tmp.idMatStk = stockId;

      let dataMatStk = await this.app.models.MaterialStock.findById(stockId);
      if (!dataMatStk) {
        throw createError(400, 'error.DATA_NOT_EXIST');
      }

      tmp.type = dataMatStk.type;

      let dataMatExp = await Materialexport.find({ where: { stockId } });
      if (!dataMatExp || !dataMatExp.length) {
        tmp.value = 0;
        return tmp;
      }

      let sum = 0;
      for (let i = 0; i < dataMatExp.length; i++) {
        sum += dataMatExp[i].exportValue;
      }

      tmp.value = sum;
      return tmp;
    } catch (e) {
      throw e;
    }
  };
  Materialexport.remoteMethod('getSumExportStock', {
    accepts: [{ arg: 'stockId', type: 'string' }],
    http: { verb: 'get' },
    returns: { arg: 'value', type: 'object', root: true },
  });
};
