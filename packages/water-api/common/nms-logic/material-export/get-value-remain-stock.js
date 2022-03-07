'use strict';

module.exports = function(Materialexport) {
  Materialexport.getValueRemainStock = async function(stockId) {
    // console.log(stockId);
    try {
      let tmp = {};
      tmp.idMatStk = stockId;
      tmp.value = '';
      if (!stockId) {
        return tmp;
      }

      let dataMatStk = await this.app.models.MaterialStock.findById(stockId);
      if (!dataMatStk) {
        return tmp;
      }

      tmp.type = dataMatStk.type;

      // console.log('1', dataMatStk);
      let dataMatExp = await Materialexport.find({ where: { stockId } });
      if (!dataMatExp || !dataMatExp.length) {
        // console.log('2', dataMatStk);
        tmp.value = dataMatStk.initValue;
        return tmp;
      }

      // console.log('3', dataMatExp);

      let sum = 0;
      for (let i = 0; i < dataMatExp.length; i++) {
        sum += dataMatExp[i].exportValue;
      }

      tmp.value = dataMatStk.initValue - sum;
      return tmp;
    } catch (e) {
      throw e;
    }
  };
  Materialexport.remoteMethod('getValueRemainStock', {
    accepts: [{ arg: 'stockId', type: 'string' }],
    http: { verb: 'get' },
    returns: { arg: 'valueRemain', type: 'object', root: true },
  });
};
