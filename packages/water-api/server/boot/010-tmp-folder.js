'use strict';
const path = require('path');
const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
module.exports = async app => {
  let tempFolder = path.join(app.dirs.root, 'temp');
  // report temp folder
  if (!fs.existsSync(tempFolder)) await exec(`mkdir -p ${tempFolder}`);

  app.dirs.temp = tempFolder;

  // spreadsheet temp folder
  const tempSheetFolder = path.join(app.dirs.root, 'tempSpreadSheet');
  const tempSheetCSV = path.join(tempSheetFolder, 'csv');
  const tempSheetExcel = path.join(tempSheetFolder, 'excel');
  const tempSheetTemplateExcel = path.join(tempSheetExcel, 'template');
  const tempSheetGeneratedExcel = path.join(tempSheetExcel, 'generated');
  const tempSheetUploadedExcel = path.join(tempSheetExcel, 'uploaded');
  const tempReport = path.join(tempFolder, 'report');
  const tempIcon = path.join(tempFolder, 'icon');

  if (!fs.existsSync(tempSheetCSV)) await exec(`mkdir -p ${tempSheetCSV}`);
  if (!fs.existsSync(tempSheetExcel)) await exec(`mkdir -p ${tempSheetExcel}`);
  if (!fs.existsSync(tempSheetTemplateExcel)) await exec(`mkdir -p ${tempSheetTemplateExcel}`);
  if (!fs.existsSync(tempSheetGeneratedExcel)) await exec(`mkdir -p ${tempSheetGeneratedExcel}`);
  if (!fs.existsSync(tempSheetUploadedExcel)) await exec(`mkdir -p ${tempSheetUploadedExcel}`);

  if (!fs.existsSync(tempReport)) await exec(`mkdir -p ${tempReport}`);
  if (!fs.existsSync(tempIcon)) await exec(`mkdir -p ${tempIcon}`);

  app.dirs = {
    ...(app.dirs || {}),
    tempReport,
    tempIcon,
    tempSheet: {
      sheet: tempSheetFolder,
      csv: tempSheetCSV,
      excel: tempSheetExcel,
      template: tempSheetTemplateExcel,
      generated: tempSheetGeneratedExcel,
      uploaded: tempSheetUploadedExcel,
    },
  };
};
