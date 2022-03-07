'use strict';

const exportClientExcel = require('../common-logic/engine/export/exportClientExcel');
const exportWaterStationReport = require('../common-logic/engine/export/exportWaterStationReport');

module.exports = function(Excelutils) {
  exportWaterStationReport(Excelutils);
  exportClientExcel(Excelutils);
};
