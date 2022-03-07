'use strict';
const moment = require('moment-timezone');
const utilCommon = require('../utils/common');
const format = require('../utils/format');

module.exports = function(Logflowloggerday) {
  // note: su dung cho site ctm-web va ctm-client
  Logflowloggerday.reportWaterFlowPressureGeneral = async function(filter) {
    // console.log('===============reportWaterFlowPressureGeneral===============', filter);
    try {
      let ret = {};

      const { typeTime, valueTimeFrom, valueTimeTo, typeStatistic, level, dmaId, parentDmaId } = filter.where;

      if (!typeTime || !valueTimeFrom || !valueTimeTo || !typeStatistic || !level || !dmaId) {
        return ret;
      }

      let isFlow = typeStatistic === 'flow';

      let cdt = {};
      if (level === 1) {
        cdt.where = dmaId === 'AllDma' ? { level } : { id: dmaId };
      } else {
        if (parentDmaId === 'AllDma' && dmaId === 'AllDma') {
          cdt.where = { level };
        } else if (parentDmaId !== 'AllDma') {
          cdt.where = dmaId === 'AllDma' ? { and: [{ level }, { parentDmaId }] } : { id: dmaId };
        }
      }

      cdt.fields = { id: true, name: true };
      let dataDma = await Logflowloggerday.app.models.Dma.find(cdt);
      if (!dataDma || !dataDma.length) {
        return ret;
      }
      // console.log('dataDma', dataDma);

      let start, end, distTime, keyTime, modelLog; // formatTime

      switch (typeTime) {
        case 'hour': {
          modelLog = 'LogFlowLoggerHour';
          keyTime = 'hour';
          // formatTime = 'YYYY-MM-DD hh:mm:ss';
          break;
        }
        case 'day': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'day';
          // formatTime = 'YYYY-MM-DD';
          break;
        }
        case 'month': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'month';
          // formatTime = 'YYYY-MM';
          break;
        }
        case 'year': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'year';
          // formatTime = 'YYYY';
          break;
        }
        default: {
          return ret;
        }
      }

      if (typeTime === 'hour') {
        distTime = 24;
      } else {
        distTime = moment(valueTimeTo)
          .startOf(keyTime)
          .diff(moment(valueTimeFrom).startOf(keyTime), keyTime);
        distTime = distTime + 1; // add 1 for current time
      }

      // start = moment(valueTimeFrom, formatTime)
      //   .startOf(keyTime)
      //   .toDate();
      start = moment(valueTimeFrom).startOf(keyTime);

      let index = 0;
      let info = [];

      for (let i = 1; i <= distTime; i++) {
        end = moment(start).endOf(keyTime);

        let div = utilCommon.countDays(start, keyTime);

        cdt = {};
        cdt.fields = { id: true, key: true, logTime: true, avgFlowRate: true, avgPressure: true };
        cdt.where = {
          and: [{ logTime: { between: [start, end] } }],
        };

        let tmpLogs = await Logflowloggerday.app.models[modelLog].find(cdt);

        let tmp = {};
        tmp.id = index;
        index++;
        tmp.time = start;
        tmp.typeStatistic = typeStatistic;
        tmp.typeTime = typeTime;

        for (let k = 0; k < dataDma.length; k++) {
          let itemDma = dataDma[k];

          // console.log('general tmp log', tmpLogs.length);
          let dataLog = await Logflowloggerday.filterDataLog(tmpLogs, itemDma.id);
          // console.log('general dataLog length', dataLog.length);

          if (!dataLog || !dataLog.length) {
            tmp[itemDma.name] = 0;
          } else {
            // console.log('general dataLog', dataLog);
            let total = 0;
            for (let k = 0; k < dataLog.length; k++) {
              if (isFlow) {
                total += parseFloat(dataLog[k].avgFlowRate);
              } else {
                total += parseFloat(dataLog[k].avgPressure);
              }
            }
            total = total / div;
            // console.log('general dataLog:   ', total);
            tmp[itemDma.name] = format.formatWithDec(total, 2);
          }
        }
        info.push(tmp); // moi record la 1 thoi gian va collect thong tin cua dma tai time nay

        // next time
        start = moment(valueTimeFrom)
          .startOf(keyTime)
          .add(i, keyTime);
      }

      ret.records = info;
      ret.dmaNames = Object.keys(dataDma).map(i => dataDma[i].name);
      // console.log(dataCollect);
      return ret;
    } catch (e) {
      throw e;
    }
  };

  // report luu luong ap luc, su dung cho chart
  Logflowloggerday.remoteMethod('reportWaterFlowPressureGeneral', {
    accepts: [{ arg: 'filter', type: 'object' }],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });

  // lay flow, pressure design cua datalogger
  Logflowloggerday.getDesignInitDataLogger = async function(isFlow, dataLoggerName, dmaId) {
    let tmp = {};
    tmp.designFlow = 0;
    tmp.designPressure = 0;

    let cdt = {};
    cdt.where = { and: [{ optionKey: dataLoggerName }, { dmaId }] };
    let mat = await Logflowloggerday.app.models.MaterialUse.findOne(cdt);
    if (mat) {
      tmp.dataLoggerName = mat.name; // ten datalogger
      if (isFlow && mat.meta.designFlow) {
        tmp.designFlow = mat.meta.designFlow;
      } else if (mat.meta.designPressure) {
        tmp.designPressure = mat.meta.designPressure;
      }
    }
    return tmp;
  };

  // get datalogger thuoc dmaId
  Logflowloggerday.filterDataLog = async function(dataLog, dmaId) {
    let ret = [];
    // for (let i = 0; i < dataLog.length; i++) {
    //   let item = dataLog[i];
    //   let nameDataLogger = item.key;
    //   let cdt = {};
    //   cdt.where = { and: [{ optionKey: nameDataLogger }, { dmaId }] };
    //   let tmp = await Logflowloggerday.app.models.MaterialUse.findOne(cdt);
    //   if (tmp) {
    //     ret.push(item);
    //   }
    // }
    // return ret;

    // tim cac datalogger thuoc dmaId
    let cdt = {};
    cdt.where = { dmaId };
    cdt.fields = { optionKey: true };
    let tmp = await Logflowloggerday.app.models.MaterialUse.find(cdt);
    if (!tmp || !tmp.length) {
      return ret;
    }
    // console.log(tmp[0].optionKey);
    // tim log thuoc datalogger
    for (let i = 0; i < dataLog.length; i++) {
      for (let k = 0; k < tmp.length; k++) {
        if (tmp[k].optionKey && tmp[k].optionKey === dataLog[i].key) {
          ret.push(dataLog[i]);
        }
      }
    }
    return ret;
  };

  // note: su dung cho site ctm-web va ctm-client
  Logflowloggerday.reportWaterFlowPressureOverLimit = async function(filter, res) {
    // console.log('======================reportWaterFlowPressureOverLimit======================', filter);
    try {
      let dataCollect = [];
      const {
        typeTime,
        valueTimeFrom,
        valueTimeTo,
        typeStatistic,
        level,
        dmaId,
        parentDmaId,
        modelConfig,
      } = filter.where;

      // model config
      let cf = 'NmsConfig'; // default
      if (modelConfig) {
        cf = modelConfig;
      }

      if (!typeTime || !valueTimeFrom || !valueTimeTo || !typeStatistic || !level || !dmaId) {
        res.header('content-range', 0);
        return dataCollect;
      }

      let isFlow = typeStatistic === 'flow';
      let cdt = {};

      if (level === 1) {
        cdt.where = dmaId === 'AllDma' ? { level } : { id: dmaId };
      } else {
        if (parentDmaId === 'AllDma' && dmaId === 'AllDma') {
          cdt.where = { level };
        } else if (parentDmaId !== 'AllDma') {
          cdt.where = dmaId === 'AllDma' ? { and: [{ level }, { parentDmaId }] } : { id: dmaId };
        }
      }
      cdt.fields = { id: true, name: true };
      let dataDma = await Logflowloggerday.app.models.Dma.find(cdt);
      // console.log('dataDma', dataDma);
      if (!dataDma || !dataDma.length) {
        res.header('content-range', 0);
        return dataCollect;
      }

      let start, end, distTime, keyTime, modelLog; // formatTime

      switch (typeTime) {
        case 'hour': {
          modelLog = 'LogFlowLoggerHour';
          keyTime = 'hour';
          // formatTime = 'YYYY-MM-DD hh:mm:ss';
          break;
        }
        case 'day': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'day';
          // formatTime = 'YYYY-MM-DD';
          break;
        }
        case 'month': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'month';
          // formatTime = 'YYYY-MM';
          break;
        }
        case 'year': {
          modelLog = 'LogFlowLoggerDay';
          keyTime = 'year';
          // formatTime = 'YYYY';
          break;
        }
        default: {
          res.header('content-range', 0);
          return dataCollect;
        }
      }

      let index = 0;
      if (typeTime === 'hour') {
        distTime = 24;
      } else {
        distTime = moment(valueTimeTo)
          .startOf(keyTime)
          .diff(moment(valueTimeFrom).startOf(keyTime), keyTime);
        distTime = distTime + 1; // add 1 for current time
      }

      // start = moment(valueTimeFrom, formatTime)
      //   .startOf(keyTime)
      //   .toDate();

      start = moment(valueTimeFrom).startOf(keyTime);

      cdt = {};
      let config;
      if (isFlow) {
        config = await Logflowloggerday.app.models[cf].findById('Flow');
      } else {
        config = await Logflowloggerday.app.models[cf].findById('Pressure');
      }
      // console.log('config', config);
      if (!config) {
        res.header('content-range', 0);
        return dataCollect;
      }
      // console.log(start, end, keyTime);
      for (let i = 1; i <= distTime; i++) {
        end = moment(start).endOf(keyTime);

        let div = utilCommon.countDays(start, keyTime);

        cdt = {};
        cdt.fields = { id: true, key: true, logTime: true, avgFlowRate: true, avgPressure: true };
        cdt.where = {
          and: [{ logTime: { between: [start, end] } }],
        };
        let tmpLogs = await Logflowloggerday.app.models[modelLog].find(cdt);
        if (!tmpLogs || !tmpLogs.length) {
          start = moment(valueTimeFrom)
            .startOf(keyTime)
            .add(i, keyTime);
          continue;
        }
        for (let k = 0; k < dataDma.length; k++) {
          let itemDma = dataDma[k];

          // console.log('tmpLogs limit', tmpLogs.length, itemDma.id, itemDma.name, start);
          let dataLog = await Logflowloggerday.filterDataLog(tmpLogs, itemDma.id);
          // console.log('datalog limit', dataLog);

          // lay danh sach cac ten datalogger
          let collectLogger = utilCommon.getDataUnique(dataLog, 'key');
          if (!collectLogger) {
            continue;
          }
          // console.log('collectLogger: ', collectLogger);

          for (let m = 0; m < collectLogger.length; m++) {
            let tmp = {};
            tmp.id = index;
            index++;
            tmp.time = start;
            tmp.typeStatistic = typeStatistic;
            tmp.typeTime = typeTime;

            // lay design flow, design pressure
            let val = await Logflowloggerday.getDesignInitDataLogger(isFlow, collectLogger[m], itemDma.id);
            let designFlow = val.designFlow;
            let designPressure = val.designPressure;
            let dataLoggerName = val.dataLoggerName;
            // console.log('>>design', designFlow, designPressure);

            let tmpFlow = 0;
            let tmpPressure = 0;
            for (let v = 0; v < dataLog.length; v++) {
              if (dataLog[v].key !== collectLogger[m]) {
                continue;
              }
              tmpFlow += parseFloat(dataLog[v].avgFlowRate);
              tmpPressure += parseFloat(dataLog[v].avgPressure);
            }
            tmpFlow = tmpFlow / div;
            tmpPressure = tmpPressure / div;
            tmpFlow = format.formatWithDec(tmpFlow, 2);
            tmpPressure = format.formatWithDec(tmpPressure, 2);
            // console.log('>>>>>total:', tmpFlow, tmpFlow);
            // so sanh voi config
            // flow
            if (isFlow) {
              let t = eval(`${config.value.high.value} * ${designFlow} / 100`);
              let limit = designFlow + t;
              // console.log(
              //   'flow high: ',
              //   tmp.time,
              //   collectLogger[m],
              //   config.value.high.value,
              //   config.value.high.condition,
              //   designFlow,
              //   tmpFlow,
              //   limit,
              // );
              if (eval(`${tmpFlow} ${config.value.high.condition} ${limit}`)) {
                tmp.dmaName = itemDma.name;
                tmp.dataLoggerName = dataLoggerName;
                tmp.totalFlow = tmpFlow;
                tmp.totalPressure = tmpPressure;
                tmp.status = 'generic.conclusionFlow.high';
                dataCollect.push(tmp);
              }
            } else {
              // pressure
              tmp.dmaName = itemDma.name;
              tmp.dataLoggerName = dataLoggerName;
              tmp.totalFlow = tmpFlow;
              tmp.totalPressure = tmpPressure;

              // ap luc cao
              let val = eval(`${config.value.high.value} * ${designPressure} / 100`);
              let limit = designPressure + val;
              // console.log('>>t', config.value.high.value, designPressure, limit);
              if (eval(`${tmpPressure} ${config.value.high.condition} ${limit}`)) {
                tmp.status = 'generic.conclusionPressure.high';
                tmp.keyAlert = 'high';
                dataCollect.push(tmp);
              } else {
                // mat nuoc
                val = eval(`${config.value.loss.value} * ${designPressure} / 100`);
                limit = designPressure + val;
                if (eval(`${tmpPressure} ${config.value.loss.condition} ${limit}`)) {
                  // console.log(
                  //   'loss water: ',
                  //   tmp.time,
                  //   tmp.dataLoggerName,
                  //   config.value.loss.value,
                  //   config.value.loss.condition,
                  //   designPressure,
                  //   tmpPressure,
                  //   limit,
                  // );
                  tmp.status = 'generic.conclusionPressure.loss';
                  tmp.keyAlert = 'loss';
                  dataCollect.push(tmp);
                } else {
                  // ap luc yeu
                  val = eval(`${config.value.low.value} * ${designPressure} / 100`);
                  limit = designPressure - val;
                  if (eval(`${tmpPressure} ${config.value.low.condition} ${limit}`)) {
                    // console.log(
                    //   'low pressure: ',
                    //   tmp.time,
                    //   tmp.dataLoggerName,
                    //   config.value.low.value,
                    //   config.value.low.condition,
                    //   designPressure,
                    //   tmpPressure,
                    //   limit,
                    // );
                    tmp.status = 'generic.conclusionPressure.low';
                    tmp.keyAlert = 'low';
                    dataCollect.push(tmp);
                  }
                }
              }
            }
          }
        }

        // next time
        start = moment(valueTimeFrom)
          .startOf(keyTime)
          .add(i, keyTime);
      }
      // console.log(dataCollect.length);
      // if (!dataCollect || !dataCollect.length) {
      //   res.header('content-range', 0);
      //   return dataCollect;
      // }

      const { order } = filter;

      // lay tat ca
      if (!order) {
        res.header('content-range', dataCollect.length);
        return dataCollect;
      }

      // // phan trang
      // let dataTmp = utilCommon.splitPage(dataCollect, limit, skip);

      // // sort
      // let dataSort = utilCommon.sort(dataTmp, order);
      // res.header('content-range', dataCollect.length);
      // return dataSort;
      return utilCommon.filterData(filter, dataCollect, res);
    } catch (e) {
      throw e;
    }
  };
  // report luu luong ap luc vuot qua nguong, su dung cho list
  Logflowloggerday.remoteMethod('reportWaterFlowPressureOverLimit', {
    accepts: [
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: { arg: 'data', type: 'object', root: true },
  });
};
