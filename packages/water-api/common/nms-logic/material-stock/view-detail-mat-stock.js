const _ = require('lodash');
const utilCommon = require('../../utils/common');
module.exports = function(Materialstock) {
  Materialstock.stMatStockDetail = async function(type, detailTypeId) {
    try {
      let dataCollect = [];
      let cdt = {};
      cdt.where = { type, detailTypeId };
      let dataStk = await Materialstock.find(cdt);
      if (!dataStk || !dataStk.length) {
        return dataCollect;
      }
      for (let i = 0; i < dataStk.length; i++) {
        let tmp = {};
        let totalInitValue = 0;
        let totalExportValue = 0;
        let totalCurrentValue = 0;

        let itemStk = dataStk[i];
        totalInitValue = itemStk.initValue;

        cdt.where = { stockId: itemStk.id };
        cdt.fields = { exportValue: true, currentValue: true };
        let dataExp = await this.app.models.MaterialExport.find(cdt);
        if (dataExp && dataExp.length) {
          let tmp1 = _.sumBy(dataExp, 'exportValue');
          let tmp2 = _.sumBy(dataExp, 'currentValue');
          totalExportValue = tmp1 ? tmp1 : 0;
          totalCurrentValue = tmp2 ? tmp2 : 0;
        }
        tmp.id = i;
        tmp.name = itemStk.name; // ten vat tu
        tmp.totalInitValue = totalInitValue; // nhap kho
        tmp.totalExportValue = totalExportValue; // xuat kho
        tmp.totalCurrentValue = totalInitValue - totalExportValue; // ton kho
        tmp.totalUseValue = totalExportValue - totalCurrentValue; // dang su dung
        tmp.unit = itemStk.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        tmp.adjustValue = itemStk.adjustValue;
        dataCollect.push(tmp);
      }
      return dataCollect;
    } catch (e) {
      // throw e;
    }
  };

  Materialstock.viewDetailMatStock = async (filter, res) => {
    try {
      let ret = [];
      if (!filter.where) {
        res.header('content-range', 0);
        return ret;
      }
      let { idTypeMat, dmaId, flgIncludeChild } = filter.where;
      if (!idTypeMat) {
        res.header('content-range', 0);
        return ret;
      }
      let typeMat = await Materialstock.app.models.MaterialDetailType.findById(idTypeMat);
      if (!typeMat) {
        res.header('content-range', 0);
        return ret;
      }
      let collectDmaIds = await utilCommon.getDmaIds(Materialstock, dmaId, flgIncludeChild, dmaId === 'AllDma');
      let dataCollect = [];
      dataCollect = await Materialstock.stMatStockDetail(typeMat.type, idTypeMat, collectDmaIds);
      const { limit, skip, order } = filter;

      if (!dataCollect || !dataCollect.length) {
        res.header('content-range', 0); // tong record
        return ret;
      }

      // phan trang
      let dataTmp = utilCommon.splitPage(dataCollect, limit, skip);

      // sort
      let dataSort = utilCommon.sort(dataTmp, order);
      res.header('content-range', dataCollect.length); // tong record
      return dataSort;
    } catch (error) {
      //
    }
  };
  Materialstock.remoteMethod('viewDetailMatStock', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
