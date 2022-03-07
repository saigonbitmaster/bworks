'use strict';
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const numeral = require('numeral');
const round = require('lodash/round');
const d3 = require('d3-ease');

const defaultPath = path.join(__dirname, '../../csvs/input-files');
// const GENERATE_MONTHS = 6;
// generate csv EMS data logger
const header =
  'STT,Datalogger ID,TimeStamp,Instantaneous Flow Rate Value,Accumulated Flow Rate Value,Pressure Value,Baterry Capacity Rate,';
const cacheRandom = {};
const gti5 = async ({
  // lastLogId,
  optionKey,
  // model,
  flowRateRange,
  // flowIncreseRange,
  pressureRange,
  startLogTime,
  // batteryRange,
  csvPath,
  // lastFlow: rawLastFlow,
  // lastBattery: rawLastBattery,
  lastData = {
    flowRate: 0,
    flow: 0,
    pressure: 0,
    battery: 0,
  },
  // ...rest
}) => {
  // get latest record
  let currentFlow = lastData.flow;
  let currentBattery = lastData.battery;
  let currentFlowRate = lastData.flowRate;
  let currentPressure = lastData.pressure;
  // generate 60 record
  let fileContent = header + '\n';
  let key = isNaN(optionKey) ? optionKey : numeral(optionKey).format('000000000000');

  let randomTo = Math.random();
  cacheRandom[optionKey] = randomTo;
  const totalMinutes = 60;
  let logTime = startLogTime;
  let pressureVariance = Math.random() * pressureRange.variance * 2;
  let flowVariance = Math.random() * flowRateRange.variance * 2;
  for (let i = 0; i < totalMinutes; i++) {
    logTime = moment(startLogTime)
      .startOf('minute')
      .add(i, 'minute');
    if (!logTime.isSame(startLogTime, 'hour')) {
      // gen log in the same hour only
      break;
    }
    let linearFactor = (i + 1) / totalMinutes;
    let dataFactor = d3.easeSinInOut(linearFactor);
    const pressureValue = currentPressure * (1 - dataFactor) + (pressureRange.value + pressureVariance) * dataFactor;
    const flowRateValue = currentFlowRate * (1 - dataFactor) + (flowRateRange.value + flowVariance) * dataFactor;
    let item = {
      no: i + 1,
      time: logTime.format('YYYY/MM/DD HH:mm:ss'),
      key,
      flowRate: round((Math.random() * flowRateRange.variance + 10) / 10 + flowRateValue, 2), // add some signal noise
      pressure: round((Math.random() * pressureRange.variance + 0.2) / 10 + pressureValue, 2), // add some signal noise
      battery: Math.max(round(currentBattery - Math.random() * 0.0001, 4), 2.1),
    };
    item.flow = round(item.flowRate / 60 + currentFlow, 1); // variance, value base on hour
    currentFlow = item.flow;
    currentBattery = item.battery;
    fileContent += `${item.no},${item.time},${item.key},${item.flowRate},${item.flow},${item.pressure},${item.battery},\n`;
  }
  // write file, base on ems GTI5 csv format (wrong header)
  let fileName = `${key}_${moment(logTime).format('YYMMDDHHmm')}.csv`;
  let fullPath = path.join(csvPath ? csvPath : defaultPath, fileName);
  await fs.writeFileSync(fullPath, fileContent, 'utf8');
  return { fileName, time: logTime };
};

module.exports = { gti5 };
