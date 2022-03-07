'use strict';
const fs = require('fs');
const util = require('util');
const path = require('path');
const Papa = require('papaparse');
const glob = require('glob');
const mapSeries = util.promisify(require('async/mapSeries'));
const moment = require('moment-timezone');

const emsCsvToObj = async filePath => {
  return new Promise((resolve, reject) => {
    let content = fs.readFileSync(filePath).toString();
    Papa.parse(content, {
      complete: data => {
        if (data.data.length > 0) data.data.shift();
        resolve(data.data);
      },
      error: err => {
        reject(err);
      },
    });
  });
};
const parseCellNum = cell => {
  return isNaN(cell) ? 0 : parseFloat(cell);
};
const collectCsvHour = async ({ app }) => {
  try {
    // path config
    let csvs = []; // write to result job;
    const emsCsvPath = await app.models.NmsConfig.getConfigByKey('EmsCsvPath');
    const csvPerProcess = await app.models.NmsConfig.getConfigByKey('CsvPerProcess');
    const inputDir = emsCsvPath.value.exact
      ? emsCsvPath.value.inputDir
      : path.join(app.dirs.root, emsCsvPath.value.inputDir);
    const backupDir = emsCsvPath.value.exact
      ? emsCsvPath.value.backupDir
      : path.join(app.dirs.root, emsCsvPath.value.backupDir);

    // get list file
    let filePaths = glob.sync(`${inputDir}/*.csv`);
    if (filePaths.length > csvPerProcess);
    filePaths = filePaths.slice(0, csvPerProcess.value);
    await mapSeries(filePaths, async filePath => {
      let csvData = await emsCsvToObj(filePath);
      let logData = {};
      let count = 0;
      await mapSeries(csvData, async row => {
        // check row
        if (!row || row.length < 6) return;
        count++;
        let item = {};
        let key = isNaN(row[2]) ? row[2] : parseInt(row[2]).toString();
        let time = moment(row[1], 'YYYY/MM/DD HH:mm:ss');
        let id = `${key}-${time.format('YYMMDDHH')}`;
        let itemIndex = time.minutes();
        item = {
          flowRate: parseCellNum(row[3]),
          flow: parseCellNum(row[4]),
          pressure: parseCellNum(row[5]),
          battery: parseCellNum(row[6]),
        };
        if (!logData[id]) {
          // find exist
          let log = await app.models.LogFlowLoggerHour.findById(id);
          if (!log) {
            log = {
              id,
              key,
              minFlowRate: 0,
              avgFlowRate: 0,
              maxFlowRate: 0,
              minPressure: 0,
              avgPressure: 0,
              maxPressure: 0,
              maxFlow: 0,
              minBattery: 0,
              rawData: {},
              logTime: time.startOf('hour').toDate(),
              maxLogTime: time.toDate(),
              minLogTime: time.toDate(),
              createdDate: moment().toDate(),
            };
          }
          logData[id] = log;
        }
        logData[id].rawData[itemIndex] = item;
        if (time.diff(logData[id].logTime) >= 0) {
          logData[id].maxLogTime = time.toDate();
        } else {
          logData[id].minLogTime = time.toDate();
        }
      });
      // calculate avg, min, max
      await Promise.all(
        Object.keys(logData).map(async id => {
          let log = logData[id];
          let itemKeys = Object.keys(log.rawData);
          let minFlowRate = 0;
          let totalFlowRate = 0;
          let maxFlowRate = 0;
          let minPressure = 0;
          let totalPressure = 0;
          let maxPressure = 0;
          let maxFlow = 0;
          let minBattery = 0;
          itemKeys.map(itemIndex => {
            let item = log.rawData[itemIndex];

            minFlowRate =
              minFlowRate > 0 && item.flowRate > 0
                ? Math.min(minFlowRate, item.flowRate)
                : Math.max(minFlowRate, item.flowRate);
            totalFlowRate += item.flowRate > 0 ? item.flowRate : 0;
            maxFlowRate = Math.max(maxFlowRate, item.flowRate);

            minPressure =
              minPressure > 0 && item.pressure > 0
                ? Math.min(minPressure, item.pressure)
                : Math.max(minPressure, item.pressure);
            totalPressure += item.pressure > 0 ? item.pressure : 0;
            maxPressure = Math.max(maxPressure, item.pressure);
            maxFlow = Math.max(maxFlow, item.flow);
            minBattery =
              minBattery > 0 && item.battery > 0
                ? Math.min(minBattery, item.battery)
                : Math.max(minBattery, item.battery);
          });
          log = {
            ...(log.__data || log),
            minFlowRate,
            avgFlowRate: totalFlowRate / itemKeys.length,
            maxFlowRate,
            minPressure,
            avgPressure: totalPressure / itemKeys.length,
            maxPressure,
            maxFlow,
            minBattery,
            updatedDate: moment().toDate(),
            step: 'init',
          };
          // insert or update to db
          // .... await app.models.LogFlowLoggerHour.replaceOrCreate(log);
        }),
      );
      // move file to backup dir
      let fileName = path.parse(filePath).base;
      csvs.push({ fileName, count });
      fs.renameSync(filePath, path.join(backupDir, fileName));
    });
    return { csvs };
    // parse csv
  } catch (error) {
    //
  }
};

module.exports = collectCsvHour;
