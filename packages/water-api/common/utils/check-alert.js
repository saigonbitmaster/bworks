let waterSourceUtil = {};

waterSourceUtil.countAlert = function(rawData, alertThresholds, waterParameters, waterSourceToDataLogger) {
  let newRowData = {};
  let alertRecord = {
    totalAlert: 0,
    totalCritical: 0,
    totalAlarm: 0,
    totalNormal: 0,
    detail: {},
  };
  let params = ['ntu', 'ph', 'flowRate'];
  let alerts = params.map(item => classify(alertThresholds, item, rawData, waterParameters, waterSourceToDataLogger));
  alertRecord.totalAlert = alerts.filter(item => item.alert !== 5);
  alertRecord.totalCritical = alerts.filter(item => item.alert == 1 || item.alert == 4);
  alertRecord.totalAlarm = alerts.filter(item => item.alert == 2 || item.alert == 3);
  alertRecord.totalNormal = alerts.filter(item => item.alert == 5);
  alertRecord.detail = { ...alerts };
  newRowData = Object.assign({}, rawData, { alertRecord: alertRecord });
  return newRowData;
};

function classify(alertThresholds, symbol, rawData, waterParameters, waterSourceToDataLogger) {
  let waterSourceId = waterSourceToDataLogger.filter(item => item.dataLoggers._id.equals(rawData.dataLoggerId))[0]._id;
  let value = rawData[symbol];
  let alert = 5;
  let alertItem = null;
  if (symbol == 'flowRate') {
    alertItem = alertThresholds.filter(item => waterSourceId.equals(item.waterSourceId) && item.alertParam == '2')[0];
    if (!alertItem) {
      alertItem = alertThresholds.filter(item => item.alertParam == '2')[0];
    }
  } else {
    let waterParameterId = waterParameters.filter(item => item.symbol.toLowerCase() == symbol)[0].id;
    alertItem = alertThresholds.filter(
      item => waterSourceId.equals(item.waterSourceId) && waterParameterId.equals(item.waterParameterId),
    )[0];
    if (!alertItem) {
      alertItem = alertThresholds.filter(item => waterParameterId.equals(item.waterParameterId))[0];
    }
  }

  switch (alertItem.alertType) {
    case '1':
      if (value >= alertItem.alertCriticalHigh) {
        alert = 1;
      } else if (value >= alertItem.alertHigh) {
        alert = 2;
      } else {
        alert = 5;
      }
      break;
    case '2':
      if (value >= alertItem.alertCriticalLow) {
        alert = 4;
      } else if (value >= alertItem.alertLow) {
        alert = 3;
      } else {
        alert = 5;
      }
      break;
    case '3':
      if (value >= alertItem.alertCriticalHigh) {
        alert = 1;
      } else if (value >= alertItem.alertHigh) {
        alert = 2;
      } else if (value <= alertItem.alertCriticalLow) {
        alert = 4;
      } else if (value <= alertItem.alertLow) {
        alert = 3;
      } else {
        alert = 5;
      }
      break;
    default:
      break;
  }
  return { param: symbol, alert: alert };
}

module.exports = waterSourceUtil;

/*
alert: các cảnh báo chung (tổng critical và alert)
alarm: cảnh báo bình thường 2 or 3
critical: cảnh báo nghiêm trọng 1 or 4
normal: bình thường 5
* */
