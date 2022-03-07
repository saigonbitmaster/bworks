'use strict';
const _ = require('lodash');
const moment = require('moment-timezone');
const utilCommon = require('../../utils/common');
const format = require('../../utils/format');

const collectMats = [
  'Pipe',
  'FlowLogger',
  'QualityLogger',
  'Meter',
  'Filter',
  'PressureReducing',
  'Pump',
  'Tank',
  'Valve',
  'Other',
];
module.exports = function(Materialstock) {
  Materialstock.stMatByDMAFromLog = async function(typeTime, valueTime, mats, collectDmaIds) {
    let start, end, byMonth;
    if (typeTime === 'month') {
      start = moment(valueTime)
        .startOf('month')
        .toDate();
      end = moment(valueTime)
        .endOf('month')
        .toDate();
      byMonth = true;
    } else {
      start = moment(valueTime, 'YYYY')
        .startOf('year')
        .toDate();
      end = moment(valueTime, 'YYYY')
        .endOf('year')
        .toDate();
      byMonth = false;
    }
    // console.log('logStatisticMatByDma', mats, start, end, collectDmaIds);
    try {
      let cdt = {};
      cdt.where = {
        and: [
          { type: { inq: mats } },
          { logDate: { between: [start, end] } },
          { dmaId: { inq: collectDmaIds } },
          { byMonth },
        ],
      };
      let dataLog = await this.app.models.LogStatisticMatByDma.find(cdt);

      if (!dataLog || !dataLog.length) {
        return [];
      }

      // group
      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(dataLog, fieldStockId);
      if (!idStocks.length) {
        return;
      }
      let dataCollect = [];
      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let tmp = {};
        let totalUse = 0;
        for (let k = 0; k < dataLog.length; k++) {
          let itemCollect = dataLog[k];
          if (itemCollect.stockId && itemCollect.stockId.equals(itemIdStock)) {
            tmp = Object.assign({}, itemCollect).__data;
            totalUse += itemCollect.totalUseValue;
          }
        }
        tmp.totalUseValue = totalUse;
        dataCollect.push(tmp);
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };
  Materialstock.stMatByDMAFromCurrent = async function(mats, collectDmaIds) {
    try {
      let dataCollect = [];
      let cdt = {};
      // console.log(mats, dmaId);
      cdt.where = { and: [{ type: { inq: mats } }, { dmaId: { inq: collectDmaIds } }] };
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
      // console.log(config);
      let idTypeMats = utilCommon.getIdUnique(matUses, 'detailTypeId', false);
      for (let k = 0; k < idTypeMats.length; k++) {
        let itemIdTypeMat = idTypeMats[k];
        let typeMat = await Materialstock.app.models.MaterialDetailType.findById(itemIdTypeMat);
        if (!typeMat) {
          continue;
        }
        let totalInitValue = 0;
        let totalExportValue = 0;
        let totalUseValue = 0;
        let totalAdjustValue = 0;
        for (let i = 0; i < idStocks.length; i++) {
          // tim trong kho
          cdt = {};
          cdt.fields = { initValue: true, name: true };
          let matStock = await Materialstock.findById(idStocks[i]);
          if (!matStock) {
            continue;
          }
          if (matStock.detailTypeId !== itemIdTypeMat) {
            continue;
          }
          totalInitValue += matStock.initValue ? matStock.initValue : 0;
          totalAdjustValue += matStock.adjustValue;
          // tim trong xuat kho
          cdt = {};
          cdt.where = { stockId: idStocks[i] };
          cdt.fields = { exportValue: true, currentValue: true };
          let dataExp = await this.app.models.MaterialExport.find(cdt);
          if (dataExp && dataExp.length) {
            let tmp1 = _.sumBy(dataExp, 'exportValue');
            totalExportValue += tmp1 ? tmp1 : 0;
          }

          cdt = {};
          cdt.where = { and: [{ stockId: idStocks[i] }, { dmaId: { inq: collectDmaIds } }] };
          let matUseInDma = await this.app.models.MaterialUse.find(cdt);
          if (matUseInDma && matUseInDma.length) {
            if (matStock.type === 'Pipe') {
              // console.log('matUseInDma', matUseInDma);
              let tmp2 = _.sumBy(matUseInDma, 'length');
              totalUseValue += tmp2 ? tmp2 : 0;
            } else {
              totalUseValue += matUseInDma.length;
            }
          }
        }
        let tmp = {};
        tmp.id = itemIdTypeMat;
        tmp.typeMatName = typeMat.name; // ten loai vat tu
        // tmp.type = matStock.type;
        tmp.totalInitValue = totalInitValue; // nhap kho
        tmp.totalExportValue = totalExportValue; // xuat kho
        tmp.totalCurrentValue = totalInitValue - totalExportValue; // ton kho
        tmp.totalUseValue = totalUseValue; // dang su dung
        tmp.rate = format.formatWithDec((tmp.totalCurrentValue * 100) / tmp.totalInitValue, 2); // ti le ton kho
        // tmp.statusStock = tmp.rate > 40 ? 'generic.conclusionMatDma.many' : 'generic.conclusionMatDma.less';
        if (eval(`${tmp.rate} ${config.value.high.condition} ${config.value.high.value}`)) {
          tmp.statusStock = 'generic.conclusionMatDma.many';
        } else {
          tmp.statusStock = 'generic.conclusionMatDma.less';
        }
        tmp.unit = typeMat.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        // tmp.stockId = idStocks[i];
        tmp.adjustValue = totalAdjustValue;
        dataCollect.push(tmp);
      }

      return dataCollect;
    } catch (e) {
      throw e;
    }
  };
  // thong ke vat tu theo dma
  Materialstock.statisticMatByDMA = async function(filter, res) {
    // console.log(filter);
    try {
      let ret = [];
      let dataCollect = [];

      const { typeTime, valueTime, typeMat, dmaId, flgIncludeChild } = filter.where;
      if (!typeTime || !valueTime || !typeTime || !dmaId) {
        res.header('content-range', 0); // tong record
        return ret;
      }

      let tmp = Materialstock.compareTime(typeTime, valueTime);
      let mats = [];
      // thuc hien trong time hien tai
      if (typeMat === 'AllMat') {
        mats = collectMats;
      } else {
        mats.push(typeMat);
      }

      let collectDmaIds = await utilCommon.getDmaIds(Materialstock, dmaId, flgIncludeChild, dmaId === 'AllDma');
      // console.log('==> collectDmaIds: ', collectDmaIds);
      if (tmp >= 0) {
        dataCollect = await Materialstock.stMatByDMAFromCurrent(mats, collectDmaIds);
      } else {
        // se lay data tu log
        dataCollect = await Materialstock.stMatByDMAFromLog(typeTime, valueTime, mats, collectDmaIds);
      }
      // console.log('datacollect', dataCollect);
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
    } catch (e) {
      throw e;
    }
  };

  // thong ke vat tu theo dma
  Materialstock.remoteMethod('statisticMatByDMA', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
