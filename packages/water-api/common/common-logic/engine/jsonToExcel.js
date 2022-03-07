'use strict';
const excel = require('xlsx');
const chunk = require('lodash/chunk');

const getAllKeys = objs => {
  const uniqueKeys = new Set();
  for (let obj of objs) {
    const objectKeys = Object.keys(obj);
    for (let key of objectKeys) {
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
      }
    }
  }
  return [...uniqueKeys];
};

class Template {
  constructor() {
    this.workbook = excel.utils.book_new();
  }

  addHeaders(sheetName, jsons) {
    // Get all keys
    const allKeys = getAllKeys(jsons);
    // Cache the keys
    this.keys = allKeys;
    // Add header to a new sheet
    const emptySheetWithHeader = excel.utils.aoa_to_sheet([allKeys]);
    // Add the sheet to workbook with a name
    excel.utils.book_append_sheet(this.workbook, emptySheetWithHeader, sheetName);
  }

  addJSON(sheetName, json) {
    // Get the worksheet
    const sheetWithHeader = this.workbook.Sheets[sheetName];
    if (!sheetWithHeader) {
      throw new Error('Exist no such sheet in current workbook');
    }
    // Get the keys
    const allKeys = getAllKeys(json);
    if (allKeys.every(key => this.keys.includes(key))) {
      // Add first row from "A2" cell
      excel.utils.sheet_add_json(sheetWithHeader, [json[0]], { origin: 'A2', skipHeader: true, header: this.keys });
      // Add the rest to the bottom of current worksheet
      if (json.length > 1) {
        const restJSON = json.slice(1);
        const chunkedRestJSON = chunk(restJSON);
        for (let chunk of chunkedRestJSON) {
          excel.utils.sheet_add_json(sheetWithHeader, chunk, { origin: -1, skipHeader: true, header: this.keys });
        }
      }
    } else {
      throw new Error('Keys of input JSONS does not match with template header');
    }
  }

  static writeAndSave(sheetName, jsons) {
    // Create a Template instance
    try {
      const template = new Template();
      // Add the headers
      template.addHeaders(sheetName, jsons);
      // Add JSONS
      if (jsons.length >= 1) {
        template.addJSON(sheetName, jsons);
      }
      // Return the workbook
      return template.workbook;
    } catch (err) {
      return null;
    }
  }
}

module.exports = Template;
