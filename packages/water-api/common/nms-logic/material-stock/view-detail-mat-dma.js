const _ = require('lodash');
const utilCommon = require('../../utils/common');
module.exports = function(Materialstock) {
  Materialstock.stMatDmaDetail = async function(type, detailTypeId, mats, collectDmaIds) {
    try {
      let dataCollect = [];
      let cdt = {};
      cdt.where = {
        and: [{ type }, { detailTypeId }, { dmaId: { inq: collectDmaIds } }],
      };
      let matUses = await this.app.models.MaterialUse.find(cdt);
      if (!matUses || !matUses.length) {
        return dataCollect;
      }

      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matUses, fieldStockId);
      if (!idStocks.length) {
        return dataCollect;
      }
      let config = await Materialstock.app.models.NmsConfig.findById('StatisticMatDMA');
      if (!config) {
        return dataCollect;
      }
      for (let i = 0; i < idStocks.length; i++) {
        let totalInitValue = 0;
        let totalExportValue = 0;
        let totalUseValue = 0; // tim trong kho
        cdt = {};
        cdt.fields = { initValue: true, name: true };
        let matStock = await Materialstock.findById(idStocks[i]);
        if (!matStock) {
          continue;
        }
        totalInitValue = matStock.initValue ? matStock.initValue : 0; // tim trong xuat kho
        cdt = {};
        cdt.where = { stockId: idStocks[i] };
        cdt.fields = { exportValue: true, currentValue: true };
        let dataExp = await this.app.models.MaterialExport.find(cdt);
        if (dataExp && dataExp.length) {
          let tmp1 = _.sumBy(dataExp, 'exportValue');
          totalExportValue = tmp1 ? tmp1 : 0;
        }

        cdt = {};
        cdt.where = { and: [{ stockId: idStocks[i] }, { dmaId: { inq: collectDmaIds } }] };
        let matUseInDma = await this.app.models.MaterialUse.find(cdt);
        if (matUseInDma && matUseInDma.length) {
          if (matStock.type === 'Pipe') {
            // console.log('matUseInDma', matUseInDma);
            let tmp2 = _.sumBy(matUseInDma, 'length');
            totalUseValue = tmp2 ? tmp2 : 0;
          } else {
            totalUseValue = matUseInDma.length;
          }
        }
        let tmp = {};
        tmp.id = i;
        tmp.name = matStock.name; // ten vat tu
        tmp.type = matStock.type;
        tmp.totalInitValue = totalInitValue; // nhap kho
        tmp.totalExportValue = totalExportValue; // xuat kho
        tmp.totalCurrentValue = totalInitValue - totalExportValue; // ton kho
        tmp.totalUseValue = totalUseValue; // dang su dung
        // tmp.rate = format.formatWithDec((tmp.totalCurrentValue * 100) / tmp.totalInitValue, 2); // ti le ton kho // tmp.statusStock = tmp.rate > 40 ? 'generic.conclusionMatDma.many' : 'generic.conclusionMatDma.less';
        // if (eval(`${tmp.rate} ${config.value.high.condition} ${config.value.high.value}`)) {
        //   tmp.statusStock = 'generic.conclusionMatDma.many';
        // } else {
        //   tmp.statusStock = 'generic.conclusionMatDma.less';
        // }
        tmp.unit = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        tmp.stockId = idStocks[i];
        tmp.adjustValue = matStock.adjustValue;
        dataCollect.push(tmp);
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  Materialstock.viewDetailMatDma = async (filter, res) => {
    try {
      let ret = [];
      if (!filter.where) {
        res.header('content-range', 0);
        return ret;
      }
      let { idTypeMat } = filter.where;
      if (!idTypeMat) {
        res.header('content-range', 0);
        return ret;
      }
      let typeMat = await Materialstock.app.models.MaterialDetailType.findById(idTypeMat);
      if (!typeMat) {
        res.header('content-range', 0);
        return ret;
      }
      let dataCollect = [];
      dataCollect = await Materialstock.stMatStockDetail(typeMat.type, idTypeMat);
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
  Materialstock.remoteMethod('viewDetailMatDma', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
