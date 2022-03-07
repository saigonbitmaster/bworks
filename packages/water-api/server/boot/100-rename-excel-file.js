'use strict';
const path = require('path');
const moment = require('moment');

module.exports = app => {
  app.dataSources.sheetStorage.connector.getFilename = file => {
    const excelExtension = '.xlsx';
    const filenameWithoutExtension = path.basename(file.name).replace(excelExtension, '');
    const newFilename = filenameWithoutExtension + '-' + moment().valueOf() + excelExtension;
    return newFilename;
  };
};
