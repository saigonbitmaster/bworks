const utilCommon = require('../../utils/common');
module.exports = function(Materialuse) {
  Materialuse.getUsedMat = async function(filter, res) {
    try {
      let ret = [];
      let dataCollect = [];
      let cdt = {};
      const { type, $text } = filter.where;
      let tmp = [];
      if ($text) {
        let text = $text.search;
        var pattern = new RegExp('.*' + text + '.*', 'i');
        tmp.push({ name: { like: pattern } });
      }
      if (type) {
        tmp.push({ type: type });
      }
      if (tmp.length) {
        cdt.where = { and: tmp };
      }

      let matUses = await Materialuse.find(cdt);
      if (!matUses || !matUses.length) {
        res.header('content-range', 0); // tong record
        return ret;
      }
      // console.log('1:', matUses);
      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matUses, fieldStockId);
      if (!idStocks.length) {
        res.header('content-range', 0); // tong record
        return ret;
      }
      // console.log('2:', idStocks);
      let index = 0;
      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let total = 0;
        let tmp = {};
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          if (!itemMatUse.stockId || typeof itemMatUse.stockId !== 'object') {
            continue;
          }
          if (itemMatUse.stockId.equals(itemIdStock)) {
            if (itemMatUse.type === 'Pipe') {
              total += itemMatUse.length;
            } else {
              total++;
            }
            tmp.id = index;
            ++index;
            tmp.name = itemMatUse.name;
            tmp.unit = itemMatUse.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
            tmp.type = itemMatUse.type;
          }
        }
        tmp.usedTotal = total;
        dataCollect.push(tmp);
      }
      const { limit, skip, order } = filter;
      if (!dataCollect.length) {
        res.header('content-range', 0); // tong record
        return ret;
      }
      // phan trang
      let dataTmp = utilCommon.splitPage(dataCollect, limit, skip);
      // sort
      let dataSort = utilCommon.sort(dataTmp, order);
      res.header('content-range', dataCollect.length); // tong record
      return dataSort;
    } catch (e) {
      throw e;
    }
  };
  Materialuse.remoteMethod('getUsedMat', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
