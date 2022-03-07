const moment = require('moment-timezone');
const _ = require('lodash');
const format = require('../../../common/utils/format');
const utilCommon = require('../../../common/utils/common');
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
const funcStatistic = {
  getLogDate: async function(app, modelLog, byMonth) {
    let now = new Date();
    let logDate;
    if (byMonth) {
      // logDate = moment(now).startOf('month');
      logDate = moment(now)
        .subtract(1, 'month')
        .startOf('month');
    } else {
      logDate = moment(now).startOf('year');
    }
    let cdt = { order: 'logDate DESC', where: { byMonth } };
    let instLog = await app.models[modelLog].findOne(cdt);
    if (instLog) {
      // console.log(instLog);
      let lastlogDate = instLog['logDate'];
      let tmp = byMonth ? 'month' : 'year';
      if (!lastlogDate || moment(lastlogDate).diff(moment(logDate), tmp) === 0) {
        // eslint-disable-next-line no-console
        console.log('>', modelLog, ': exist record of time', logDate.toDate());
        return '';
      }
    }
    return logDate;
  },
  mainLogStatisticMatStk: async function({ app, options }) {
    const { byMonth } = options;
    // eslint-disable-next-line no-console
    console.log('> LogStatisticMatStk: start job by', byMonth ? 'month' : 'year');
    let modelLog = 'LogStatisticMatStk';
    let logDate = await funcStatistic.getLogDate(app, modelLog, byMonth);
    if (!logDate) {
      return;
    }
    await funcStatistic.runLogStatisticMatStk(app, modelLog, collectMats, logDate, byMonth);
    // eslint-disable-next-line no-console
    console.log('> LogStatisticMatStk: end job by', byMonth ? 'month' : 'year', logDate.toDate());
  },
  runLogStatisticMatStk: async function(app, modelLog, mats, logDate, byMonth) {
    try {
      let cdt = {};
      cdt.where = { type: { inq: mats } };
      let dataStk = await app.models.MaterialStock.find(cdt);
      if (!dataStk || !dataStk.length) {
        return;
      }
      let config = await app.models.NmsConfig.findById('StatisticMatStk');
      if (!config) {
        return;
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
        let dataExp = await app.models.MaterialExport.find(cdt);
        if (dataExp && dataExp.length) {
          let tmp1 = _.sumBy(dataExp, 'exportValue');
          let tmp2 = _.sumBy(dataExp, 'currentValue');
          totalExportValue = tmp1 ? tmp1 : 0;
          totalCurrentValue = tmp2 ? tmp2 : 0;
          // console.log(totalExportValue, totalCurrentValue);
        }
        tmp.type = itemStk.type;
        tmp.name = itemStk.name; // ten vat tu
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
        tmp.unit = itemStk.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        tmp.logDate = logDate;
        tmp.byMonth = byMonth;
        tmp.adjustValue = itemStk.adjustValue;
        await app.models[modelLog].create(tmp);
      }
    } catch (e) {
      throw e;
    }
  },
  mainLogStatisticMatByDma: async function({ app, options }) {
    const { byMonth } = options;
    // eslint-disable-next-line no-console
    console.log('> LogStatisticMatByDma: start job by', byMonth ? 'month' : 'year');
    let modelLog = 'LogStatisticMatByDma';
    let logDate = await funcStatistic.getLogDate(app, modelLog, byMonth);
    if (!logDate) {
      return;
    }
    await funcStatistic.runLogStatisticMatByDma(app, modelLog, collectMats, logDate, byMonth);
    // eslint-disable-next-line no-console
    console.log('> LogStatisticMatByDma: end job by', byMonth ? 'month' : 'year', logDate.toDate());
  },
  runLogStatisticMatByDma: async function(app, modelLog, collectMats, logDate, byMonth) {
    try {
      // tim tat ca dma
      let cdt = {};
      cdt.fields = { id: true };
      let dataDmas = await app.models.Dma.find(cdt);
      if (!dataDmas || !dataDmas.length) {
        return;
      }
      let config = await app.models.NmsConfig.findById('StatisticMatDMA');
      if (!config) {
        return;
      }
      for (let i = 0; i < dataDmas.length; i++) {
        let itemDmaId = dataDmas[i].id;

        // lay cac vat tu thuoc dma
        cdt = {};
        cdt.where = { dmaId: itemDmaId };
        let collectMatUse = await app.models.MaterialUse.find(cdt);
        if (!collectMatUse || !collectMatUse.length) {
          continue;
        }
        // console.log('collectMatUse: ', collectMatUse);
        let fieldStockId = 'stockId';
        let idStocks = utilCommon.getIdUnique(collectMatUse, fieldStockId);
        if (!idStocks.length) {
          return;
        }
        for (let m = 0; m < idStocks.length; m++) {
          // console.log('idStocks', idStocks[m]);
          let totalInitValue = 0;
          let totalExportValue = 0;
          let totalUseValue = 0;

          // tim trong kho
          cdt = {};
          cdt.fields = { initValue: true, name: true };
          let matStock = await app.models.MaterialStock.findById(idStocks[m]);
          if (!matStock) {
            continue;
          }
          totalInitValue = matStock.initValue ? matStock.initValue : 0;
          // tim trong xuat kho
          cdt = {};
          cdt.where = { stockId: idStocks[m] };
          cdt.fields = { exportValue: true, currentValue: true };
          let dataExp = await app.models.MaterialExport.find(cdt);
          // console.log('dataExp', dataExp);
          if (dataExp && dataExp.length) {
            let tmp1 = _.sumBy(dataExp, 'exportValue');
            totalExportValue = tmp1 ? tmp1 : 0;
          }

          // dang su dung trong dma
          cdt = {};
          cdt.where = { and: [{ stockId: idStocks[m] }, { dmaId: itemDmaId }] };
          let matUseInDma = await app.models.MaterialUse.find(cdt);

          if (matUseInDma && matUseInDma.length) {
            if (matStock.type === 'Pipe') {
              let tmp2 = _.sumBy(matUseInDma, 'length');
              totalUseValue = tmp2 ? tmp2 : 0;
            } else {
              totalUseValue = matUseInDma.length;
            }
          }
          let tmp = {};
          tmp.name = matStock.name; // ten vat tu
          tmp.type = matStock.type; // loai vat tu
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
          tmp.unit = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
          tmp.logDate = logDate;
          tmp.byMonth = byMonth;
          tmp.dmaId = itemDmaId;
          tmp.stockId = idStocks[m];
          tmp.adjustValue = matStock.adjustValue;
          await app.models[modelLog].create(tmp);
        }
      }
    } catch (e) {
      throw e;
    }
  },
  mainLogStatisticMatByLifeSpan: async function({ app, options }) {
    const { byMonth } = options;
    // eslint-disable-next-line no-console
    console.log('> LogMatStatisticByLifeSpan: start job by', byMonth ? 'month' : 'year');
    let modelLog = 'LogMatStatisticByLifeSpan';
    let logDate = await funcStatistic.getLogDate(app, modelLog, byMonth);
    if (!logDate) {
      return;
    }
    let config = await app.models.NmsConfig.findById('StatisticMatLifeSpan');
    if (!config) {
      return;
    }
    await funcStatistic.runLogSTMatUseByLifeSpan(app, modelLog, collectMats, logDate, byMonth, config);
    await funcStatistic.runLogSTMatExportByLifeSpan(app, modelLog, collectMats, logDate, byMonth, config);
    await funcStatistic.runLogSTMatStockByLifeSpan(app, modelLog, collectMats, logDate, byMonth, config);
    // eslint-disable-next-line no-console
    console.log('> LogMatStatisticByLifeSpan: end job by', byMonth ? 'month' : 'year', logDate.toDate());
  },
  runLogSTMatUseByLifeSpan: async function(app, modelLog, collectMats, logDate, byMonth, config) {
    try {
      let tmpDate = moment(new Date(new Date(logDate).getTime())); // clone logDate
      let cdt = {};
      cdt.where = { type: { inq: collectMats } };
      let matUses = await app.models.MaterialUse.find(cdt);
      if (!matUses || !matUses.length) {
        return;
      }
      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matUses, fieldStockId);
      if (!idStocks.length) {
        return;
      }
      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let matStock = await app.models.MaterialStock.findById(itemIdStock);
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
            tmp.name = matStock.name;
            tmp.type = matStock.type;
            tmp.dom = matStock.dom; // ngay san xuat
            tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
            tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
            tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
            tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
            tmp.unitQuantityUsed = itemMatUse.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';

            let val = tmpDate.endOf('month').diff(moment(tmp.useStartDate), 'month');
            tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)

            val = tmpDate.endOf('month').diff(moment(tmp.dom), 'month');
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
            tmp.stockId = itemIdStock;
            tmp.logDate = logDate;
            tmp.byMonth = byMonth;
            tmp.statisticWhere = 'MaterialUse';
            // console.log(tmp);
            await app.models[modelLog].create(tmp);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  },
  runLogSTMatExportByLifeSpan: async function(app, modelLog, collectMats, logDate, byMonth, config) {
    try {
      let tmpDate = moment(new Date(new Date(logDate).getTime())); // clone logDate
      let cdt = {};
      cdt.where = { type: { inq: collectMats } };
      let matExports = await app.models.MaterialExport.find(cdt);
      if (!matExports || !matExports.length) {
        return;
      }

      let fieldStockId = 'stockId';
      let idStocks = utilCommon.getIdUnique(matExports, fieldStockId);
      if (!idStocks.length) {
        return;
      }

      for (let i = 0; i < idStocks.length; i++) {
        let itemIdStock = idStocks[i];
        let matStock = await app.models.MaterialStock.findById(itemIdStock);
        if (!matStock) {
          continue;
        }

        let tmp = {};
        tmp.name = matStock.name;
        tmp.type = matStock.type;
        tmp.dom = matStock.dom; // ngay san xuat
        tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
        tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
        tmp.unitQuantityUsed = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        let valMain = tmpDate.endOf('month').diff(moment(tmp.dom), 'month');
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
        tmp.stockId = itemIdStock;
        tmp.logDate = logDate;
        tmp.byMonth = byMonth;
        tmp.statisticWhere = 'MaterialExport';
        cdt = {};
        cdt.where = { stockId: itemIdStock };
        let matUses = await app.models.MaterialUse.find(cdt);
        if (!matUses || !matUses.length) {
          await app.models[modelLog].create(tmp);
          continue;
        }
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
          tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
          let val = tmpDate.endOf('month').diff(moment(tmp.useStartDate), 'month');
          tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)
          await app.models[modelLog].create(tmp);
        }
      }
    } catch (e) {
      throw e;
    }
  },
  runLogSTMatStockByLifeSpan: async function(app, modelLog, collectMats, logDate, byMonth, config) {
    try {
      let tmpDate = moment(new Date(new Date(logDate).getTime())); // clone logDate
      let cdt = {};
      cdt.where = { type: { inq: collectMats } };
      let matStocks = await app.models.MaterialStock.find(cdt);
      if (!matStocks || !matStocks.length) {
        return;
      }

      for (let i = 0; i < matStocks.length; i++) {
        let itemIdStock = matStocks[i].id;
        let matStock = matStocks[i];

        let tmp = {};
        tmp.name = matStock.name;
        tmp.type = matStock.type;
        tmp.dom = matStock.dom; // ngay san xuat
        tmp.egeTime = matStock.egeTime; // tuoi tho(thang)
        tmp.usedTime = matStock.usedTime; // thoi gian da su dung khi thu hoi(thang)
        tmp.unitQuantityUsed = matStock.type === 'Pipe' ? 'generic.units.meter' : 'generic.units.quantity';
        let valMain = tmpDate.endOf('month').diff(moment(tmp.dom), 'month');
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
        tmp.stockId = itemIdStock;
        tmp.logDate = logDate;
        tmp.byMonth = byMonth;
        tmp.statisticWhere = 'MaterialStock';
        cdt = {};
        cdt.where = { stockId: itemIdStock };
        let matUses = await app.models.MaterialUse.find(cdt);
        if (!matUses || !matUses.length) {
          await app.models[modelLog].create(tmp);
          continue;
        }
        for (let k = 0; k < matUses.length; k++) {
          let itemMatUse = matUses[k];
          tmp.useStartDate = itemMatUse.useStartDate; // ngay bat dau su dung
          tmp.quantityUsed = itemMatUse.type === 'Pipe' ? itemMatUse.length : 1;
          let val = tmpDate.endOf('month').diff(moment(tmp.useStartDate), 'month');
          tmp.totalRealTimeUsed = val < 0 ? 0 : val; // tong thoi gian dua vao su dung(thang)
          await app.models[modelLog].create(tmp);
        }
      }
    } catch (e) {
      throw e;
    }
  },
};

module.exports = funcStatistic;
