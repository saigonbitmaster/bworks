'use strict';
// eslint-disable-next-line no-unused-vars
module.exports = function(Materialexport) {
  // Materialexport.getValueRemainStock = async function(stockId) {
  //   // console.log(stockId);
  //   try {
  //     let tmp = {};
  //     tmp.idMatStk = stockId;
  //     tmp.value = '';
  //     if (!stockId) {
  //       return tmp;
  //     }
  //     let dataMatStk = await this.app.models.MaterialStock.findById(stockId);
  //     if (!dataMatStk) {
  //       return tmp;
  //     }
  //     // console.log('1', dataMatStk);
  //     let dataMatExp = await Materialexport.find({ where: { stockId } });
  //     if (!dataMatExp || !dataMatExp.length) {
  //       // console.log('2', dataMatStk);
  //       tmp.value = dataMatStk.initValue;
  //       return tmp;
  //     }
  //     // console.log('3', dataMatExp);
  //     let sum = 0;
  //     for (let i = 0; i < dataMatExp.length; i++) {
  //       sum += dataMatExp[i].exportValue;
  //     }
  //     tmp.value = dataMatStk.initValue - sum;
  //     return tmp;
  //   } catch (e) {
  //     throw e;
  //   }
  // };
  // Materialexport.remoteMethod('getValueRemainStock', {
  //   accepts: [{ arg: 'stockId', type: 'string' }],
  //   http: { verb: 'get' },
  //   returns: { arg: 'valueRemain', type: 'object', root: true },
  // });
  // Materialexport.observe('before save', (ctx, next) => {
  //   // khi xuat kho(tao moi), thi xoa field 'remainValueStock'
  //   if (ctx.isNewInstance && ctx.instance) {
  //     ctx.instance.unsetAttribute('remainValueStock');
  //     ctx.instance.currentValue = ctx.instance.exportValue;
  //   }
  //   next();
  // });
  // Materialexport.observe('before save', (ctx, next) => {
  //   if (ctx.instance && ctx.instance.keyAction === 'ReturnMatForStock') {
  //     ctx.instance.exportValue = ctx.instance.exportValue - ctx.instance.returnValue;
  //     ctx.instance.currentValue = ctx.instance.currentValue - ctx.instance.returnValue;
  //     ctx.instance.unsetAttribute('keyAction');
  //     ctx.instance.unsetAttribute('returnValue');
  //     next();
  //   } else {
  //     next();
  //   }
  // });
};
