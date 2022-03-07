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
  Materialstock.stMatStockFromCurrent = async function(mats) {
    try {
      let dataCollect = [];
      let cdt = {};
      cdt.where = { type: { inq: mats } };
      let dataStk = await Materialstock.find(cdt);
      if (!dataStk || !dataStk.length) {
        return dataCollect;
      }
      let config = await Materialstock.app.models.NmsConfig.findById('StatisticMatStk');
      if (!config) {
        return dataCollect;
      }

      let idTypeMats = utilCommon.getIdUnique(dataStk, 'detailTypeId', false);

      for (let k = 0; k < idTypeMats.length; k++) {
        let itemIdTypeMat = idTypeMats[k];
        let typeMat = await Materialstock.app.models.MaterialDetailType.findById(itemIdTypeMat);

        let tmp = {};
        let totalInitValue = 0;
        let totalExportValue = 0;
        let totalCurrentValue = 0;
        let totalAdjustValue = 0;
        for (let i = 0; i < dataStk.length; i++) {
          let itemStk = dataStk[i];
          if (itemStk.detailTypeId !== itemIdTypeMat) {
            continue;
          }

          totalInitValue += itemStk.initValue;
          totalAdjustValue += itemStk.adjustValue;

          cdt.where = { stockId: itemStk.id };
          cdt.fields = { exportValue: true, currentValue: true };
          let dataExp = await this.app.models.MaterialExport.find(cdt);
          if (dataExp && dataExp.length) {
            let tmp1 = _.sumBy(dataExp, 'exportValue');
            let tmp2 = _.sumBy(dataExp, 'currentValue');
            totalExportValue += tmp1 ? tmp1 : 0;
            totalCurrentValue += tmp2 ? tmp2 : 0;
            // console.log(totalExportValue, totalCurrentValue);
          }
        }
        if (typeMat.name === 'YSI EXO2') {
          // console.log('aaaaa');
        }
        tmp.id = itemIdTypeMat;
        tmp.typeMatName = typeMat.name; // ten loai vat tu
        tmp.totalInitValue = totalInitValue; // nhap kho
        tmp.totalExportValue = totalExportValue; // xuat kho
        tmp.totalCurrentValue = totalInitValue - totalExportValue; // ton kho
        tmp.totalUseValue = totalExportValue - totalCurrentValue; // dang su dung
        tmp.rate = format.formatWithDec((tmp.totalCurrentValue * 100) / tmp.totalInitValue, 2); // ti le ton kho
        // tmp.statusStock = tmp.rate > 40 ? 'generic.conclusionMatStock.many' : 'generic.conclusionMatStock.less';
        if (eval(`${tmp.rate} ${config.value.high.condition} ${config.value.high.value}`)) {
          tmp.statusStock = 'generic.conclusionMatStock.many';
        } else {
          tmp.statusStock = 'generic.conclusionMatStock.less';
        }
        tmp.unit = typeMat.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        tmp.adjustValue = totalAdjustValue;
        dataCollect.push(tmp);
      }

      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  Materialstock.stMatStockFromLog = async function(typeTime, valueTime, mats) {
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

    try {
      let cdt = {};
      cdt.where = { and: [{ type: { inq: mats } }, { logDate: { between: [start, end] } }, { byMonth }] };
      let dataCollect = await this.app.models.LogStatisticMatStk.find(cdt);

      if (!dataCollect || !dataCollect.length) {
        return [];
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };
  // thong ke vat tu trong kho
  Materialstock.statisticMatStock = async function(filter, res) {
    // console.log('statisticMatStock: ', filter);

    try {
      let ret = [];
      let dataCollect = [];

      const { typeTime, valueTime, typeMat } = filter.where;
      if (!typeTime || !valueTime || !typeTime) {
        res.header('content-range', 0); // tong record
        return ret;
      }
      let mats = [];
      // thuc hien trong time hien tai
      if (typeMat === 'AllMat') {
        mats = collectMats;
      } else {
        mats.push(typeMat);
      }

      let tmp = Materialstock.compareTime(typeTime, valueTime);
      // console.log('tmp', tmp);

      if (tmp >= 0) {
        // hien tai va tuong lai
        dataCollect = await Materialstock.stMatStockFromCurrent(mats);
      } else {
        // qua khu, se lay data tu log
        dataCollect = await Materialstock.stMatStockFromLog(typeTime, valueTime, mats);
      }

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
  Materialstock.remoteMethod('statisticMatStock', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
