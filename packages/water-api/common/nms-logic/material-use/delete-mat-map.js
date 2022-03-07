const get = require('lodash/get');
module.exports = function(Materialuse) {
  Materialuse.deleteMatMap = async function(ids) {
    try {
      let count = 0;
      // for (let i = 0; i < ids.length; i++) {
      //   let id = ids[i];
      //   let instUse = await Materialuse.findById(id);
      //   if (!instUse) {
      //     continue;
      //   }
      //   let exportId = instUse.exportId;
      //   let instExport = await Materialuse.app.models.MaterialExport.findById(exportId);
      //   if (instExport) {
      //     // update so luong su dung
      //     let tmp = 0;
      //     if (instUse.type === 'Pipe') {
      //       tmp = instExport.currentValue + instUse.length;
      //     } else {
      //       // vat tu khac
      //       tmp = instExport.currentValue + 1;
      //     }
      //     // console.log('tmp', tmp, exportId);
      //     await Materialuse.app.models.MaterialExport.updateAll({ id: exportId }, { currentValue: tmp });
      //   }

      //   // delete trong su dung
      //   let res = await Materialuse.destroyById(id);
      //   if (res.count && res.count > 0) {
      //     count += res.count;
      //   }
      //   // console.log(res);
      // }
      for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        let instUse = await Materialuse.findById(id);
        if (!instUse) {
          continue;
        }
        if (get(instUse, 'health') === 'BAD') {
          continue;
        }
        let stockId = get(instUse, 'stockId');
        if (!stockId) {
          continue;
        }
        let instStock = await Materialuse.app.models.MaterialStock.findById(stockId);
        if (instStock) {
          // update so luong su dung
          let tmp = 0;
          if (instUse.type === 'Pipe') {
            tmp = instStock.adjustValue + instUse.length;
          } else {
            // vat tu khac
            tmp = instStock.adjustValue + 1;
          }
          // console.log('tmp', tmp, exportId);
          await Materialuse.app.models.MaterialStock.updateAll({ id: stockId }, { adjustValue: tmp });
          count += await Materialuse.updateAll({ id }, { health: 'BAD', isDeleted: true });
          return { count };
        }

        // delete trong su dung
        // let res = await Materialuse.destroyById(id);
        // if (res.count && res.count > 0) {
        //   count += res.count;
        // }
        // console.log(res);
      }
    } catch (e) {
      throw e;
    }
  };

  Materialuse.remoteMethod('deleteMatMap', {
    accepts: [{ arg: 'ids', type: 'array' }],
    http: { verb: 'GET' },
    returns: { arg: 'count', type: 'number', root: true },
  });
};
