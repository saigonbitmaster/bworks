'use strict';
const moment = require('moment-timezone');
const utilCommon = require('../../utils/common');

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
  Materialstock.remoteMethod('statisticMatByLifeSpan', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  Materialstock.compareTime = function(typeTime, valueTime) {
    // format time
    let timeInput = '';
    let current = '';
    if (typeTime === 'month') {
      timeInput = moment(valueTime).startOf('month');
      current = moment(new Date()).startOf('month');
    } else if (typeTime === 'year') {
      timeInput = moment(valueTime, 'YYYY').startOf('year');
      current = moment(new Date()).startOf('year');
    }
    return timeInput.diff(current, typeTime);
  };

  // thong ke tuoi tho vat tu
  Materialstock.statisticMatByLifeSpan = async function(filter, res) {
    // console.log('statisticMatByLifeSpan: ', filter);
    try {
      let ret = [];
      let dataCollect = [];

      const { typeMat, valueTime, typeTime, statisticWhere } = filter.where;
      if (!statisticWhere || !typeTime || !valueTime || !typeTime) {
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
      if (tmp >= 0) {
        dataCollect = await Materialstock.mainStMatByLifeSpanFromCurrent(statisticWhere, mats);
      } else {
        // se lay data tu log
        dataCollect = await Materialstock.stMatByLifeSpanFromLog(statisticWhere, typeTime, valueTime, mats);
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
      // console.log(dataCollect.length, dataSort.length);
      res.header('content-range', dataCollect.length); // tong record
      return dataSort;
    } catch (e) {
      throw e;
    }
  };

  Materialstock.mainStMatByLifeSpanFromCurrent = async function(statisticWhere, mats) {
    let config = await Materialstock.app.models.NmsConfig.findById('StatisticMatLifeSpan');
    if (!config) {
      return [];
    }
    // console.log(config);
    if (statisticWhere === 'MaterialUse') {
      return await Materialstock.stMatUse(mats, config);
    } else if (statisticWhere === 'MaterialStock') {
      return await Materialstock.stMatStock(mats, config);
    } else if (statisticWhere === 'MaterialExport') {
      return await Materialstock.stMatExport(mats, config);
    } else {
      return [];
    }
  };

  Materialstock.stMatByLifeSpanFromLog = async function(statisticWhere, typeTime, valueTime, mats) {
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
    // console.log('statisticMatByLifeSpanFromLog', typeTime, valueTime, mats);
    try {
      let cdt = {};
      cdt.where = {
        and: [{ statisticWhere }, { type: { inq: mats } }, { logDate: { between: [start, end] } }, { byMonth }],
      };
      let dataCollect = await this.app.models.LogMatStatisticByLifeSpan.find(cdt);

      if (!dataCollect || !dataCollect.length) {
        return [];
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  // thong tuoi tho vat tu dang su dung
  Materialstock.stMatUse = async function(mats, config) {
    try {
      let dataCollect = [];
      let cdt = {};
      cdt.where = { type: { inq: mats } };
      let matUses = await this.app.models.MaterialUse.find(cdt);
      if (!matUses || !matUses.length) {
        return dataCollect;
      }
      // console.log('1:', matUses[0]);
      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matUses, fieldStockId);
      if (!idStocks.length) {
        return dataCollect;
      }
      let index = 0;
      // console.log(idStocks);
      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let matStock = await Materialstock.findById(itemIdStock);
        if (!matStock) {
          continue;
        }
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          if (!itemMatUse.stockId || typeof itemMatUse.stockId !== 'object') {
            continue;
          }
          if (itemMatUse.stockId.equals(itemIdStock)) {
            let tmp = {};
            tmp.id = index;
            ++index;
            tmp.name = matStock.name;
            tmp.dom = matStock.dom; // ngay san xuat
            tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
            tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
            tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
            tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
            tmp.unitQuantityUsed = itemMatUse.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
            let val;
            val = moment(new Date()).diff(moment(tmp.useStartDate), 'month');
            tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)

            val = moment(new Date()).diff(moment(tmp.dom), 'month');
            // console.log(matStock.name, monthCur, monthUseStart, monthDom);

            val = val < 0 ? 0 : val;
            val = tmp.egeTime - tmp.usedTime - val;
            tmp.remainTime = val < 0 ? 0 : val; // thoi gian con lai(thang)
            // if (tmp.remainTime > 4) {
            //   tmp.conclusion = 'generic.conclusionExpireTime.existTime';
            // } else if (tmp.remainTime > 0) {
            //   tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
            // } else {
            //   tmp.conclusion = 'generic.conclusionExpireTime.overTime';
            // }
            if (eval(`${tmp.remainTime} ${config.value.existTime.condition} ${config.value.existTime.value}`)) {
              tmp.conclusion = 'generic.conclusionExpireTime.existTime';
            } else if (eval(`${tmp.remainTime} ${config.value.lessTime.condition} ${config.value.lessTime.value}`)) {
              tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
            } else {
              tmp.conclusion = 'generic.conclusionExpireTime.overTime';
            }
            dataCollect.push(tmp);
          }
        }
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  // thong ke tuoi tho vat tu trong kho
  Materialstock.stMatStock = async function(mats, config) {
    try {
      let dataCollect = [];
      let cdt = {};
      cdt.where = { type: { inq: mats } };
      let matStocks = await this.app.models.MaterialStock.find(cdt);
      if (!matStocks || !matStocks.length) {
        return dataCollect;
      }

      let index = 0;

      for (let i = 0; i < matStocks.length; i++) {
        let itemIdStock = matStocks[i].id;
        let matStock = matStocks[i];

        let tmp = {};
        tmp.id = index;
        tmp.name = matStock.name;
        tmp.dom = matStock.dom; // ngay san xuat
        tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
        tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
        tmp.unitQuantityUsed = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        let valMain = moment(new Date()).diff(moment(tmp.dom), 'month');
        valMain = valMain < 0 ? 0 : valMain;
        valMain = tmp.egeTime - tmp.usedTime - valMain;
        tmp.remainTime = valMain < 0 ? 0 : valMain; // thoi gian con lai(thang)
        // if (tmp.remainTime > 4) {
        //   tmp.conclusion = 'generic.conclusionExpireTime.existTime';
        // } else if (tmp.remainTime > 0) {
        //   tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
        // } else {
        //   tmp.conclusion = 'generic.conclusionExpireTime.overTime';
        // }
        if (eval(`${tmp.remainTime} ${config.value.existTime.condition} ${config.value.existTime.value}`)) {
          tmp.conclusion = 'generic.conclusionExpireTime.existTime';
        } else if (eval(`${tmp.remainTime} ${config.value.lessTime.condition} ${config.value.lessTime.value}`)) {
          tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
        } else {
          tmp.conclusion = 'generic.conclusionExpireTime.overTime';
        }
        cdt = {};
        cdt.where = { stockId: itemIdStock };
        let matUses = await this.app.models.MaterialUse.find(cdt);
        if (!matUses || !matUses.length) {
          dataCollect.push(tmp);
          ++index;
          continue;
        }
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
          tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
          let val = moment(new Date()).diff(moment(tmp.useStartDate), 'month');
          tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)
          dataCollect.push(tmp);
          ++index;
        }
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };

  // thong tuoi tho vat tu trong xuat kho
  Materialstock.stMatExport = async function(mats, config) {
    // console.log('stMatExport');
    try {
      let dataCollect = [];

      let cdt = {};
      cdt.where = { type: { inq: mats } };
      let matExports = await this.app.models.MaterialExport.find(cdt);
      if (!matExports || !matExports.length) {
        return dataCollect;
      }

      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matExports, fieldStockId);
      if (!idStocks.length) {
        return dataCollect;
      }

      let index = 0;
      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let matStock = await Materialstock.findById(itemIdStock);
        if (!matStock) {
          continue;
        }

        let tmp = {};
        tmp.id = index;
        tmp.name = matStock.name;
        tmp.dom = matStock.dom; // ngay san xuat
        tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
        tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
        tmp.unitQuantityUsed = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        let valMain = moment(new Date()).diff(moment(tmp.dom), 'month');
        valMain = valMain < 0 ? 0 : valMain;
        valMain = tmp.egeTime - tmp.usedTime - valMain;
        // console.log(matStock.name, valMain, tmp.egeTime, tmp.usedTime);
        tmp.remainTime = valMain < 0 ? 0 : valMain; // thoi gian con lai(thang)
        // if (tmp.remainTime > 4) {
        //   tmp.conclusion = 'generic.conclusionExpireTime.existTime';
        // } else if (tmp.remainTime > 0) {
        //   tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
        // } else {
        //   tmp.conclusion = 'generic.conclusionExpireTime.overTime';
        // }
        if (eval(`${tmp.remainTime} ${config.value.existTime.condition} ${config.value.existTime.value}`)) {
          tmp.conclusion = 'generic.conclusionExpireTime.existTime';
        } else if (eval(`${tmp.remainTime} ${config.value.lessTime.condition} ${config.value.lessTime.value}`)) {
          tmp.conclusion = 'generic.conclusionExpireTime.lessTime';
        } else {
          tmp.conclusion = 'generic.conclusionExpireTime.overTime';
        }
        cdt = {};
        cdt.where = { stockId: itemIdStock };
        let matUses = await this.app.models.MaterialUse.find(cdt);
        if (!matUses || !matUses.length) {
          dataCollect.push(tmp);
          ++index;
          continue;
        }
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
          tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
          let val = moment(new Date()).diff(moment(tmp.useStartDate), 'month');
          tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)
          dataCollect.push(tmp);
          ++index;
        }
      }
      return dataCollect;
    } catch (e) {
      throw e;
    }
  };
};
