'use strict';
const error = require('../../i18n/vi/error');
const path = require('path');
const fs = require('fs');

module.exports = function(ClientFormat) {
  function validateExistingTemplate(err) {
    const templateName = this.realName;
    const templateExcelDir = ClientFormat.app.dirs.tempSheet.template;
    const templatePath = path.join(templateExcelDir, templateName);
    if (!fs.existsSync(templatePath)) {
      err();
    }
  }
  ClientFormat.validate('realName', validateExistingTemplate, { err: error.FILE_NOT_EXIST });
};
