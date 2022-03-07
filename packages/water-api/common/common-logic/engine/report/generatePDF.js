'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
var Docxtemplater = require('docxtemplater');
const ImageModule = require('open-docxtemplater-image-module');
const JSZip = require('jszip');
const { get } = require('lodash');
const moment = require('moment-timezone');
const numeral = require('numeral');
const delay = require('delay');
const expressions = require('angular-expressions');
const libreoffice = require('../../../utils/libreoffice');

module.exports = function(Reportengine) {
  expressions.filters.lower = function(input) {
    // This condition should be used to make sure that if your input is undefined, your output will be undefined as well and will not throw an error
    if (!input) return input;
    return input.toLowerCase();
  };
  const transformValue = function(val) {
    if (typeof val === 'number' && val !== 0) {
      return numeral(val).format();
    }
    return val;
  };
  const angularParser = function(tag) {
    return {
      get:
        tag === '.'
          ? function(s) {
              return transformValue(s || '');
            }
          : function(s) {
              return transformValue(expressions.compile(tag.replace(/(’|“|”)/g, "'"))(s) || '');
            },
    };
  };
  const imageOptions = {
    // eslint-disable-next-line no-unused-vars
    getImage: (tagValue, tagName) => {
      let filePath = typeof tagValue === 'string' ? tagValue : get(tagValue, 'url');
      return fs.readFileSync(filePath);
    },
    // eslint-disable-next-line no-unused-vars
    getSize: (img, tagValue, tagName) => {
      // fix size
      if (tagValue.size) {
        return Array.isArray(tagValue.size) ? tagValue.size : [tagValue.width, tagValue.height];
      }
      // calculate size
      let sizeOf = require('image-size');
      let sizeObj = sizeOf(img);
      if (sizeObj) {
        return [sizeObj.width, sizeObj.height];
      }
      return [0, 0]; // unknow
    },
  };
  Reportengine.streamToFile = (readStream, filePath) => {
    return new Promise((resolve, reject) => {
      let writeStream = fs.createWriteStream(filePath);
      readStream.on('finish', () => {
        resolve();
      });
      readStream.on('error', err => reject(err));
      readStream.pipe(writeStream);
    });
  };
  // eslint-disable-next-line no-unused-vars
  Reportengine.pregen = async (data = {}, templateId = '', templateModel = 'CtmTemplate', fileModel = 'CtmFile') => {
    let fileExt = 'pdf';
    let current = moment();
    let tempReport = Reportengine.app.dirs.tempReport;
    let filePostfix = current.format('YYYYMMDDHHmmssSSS');
    // Create hash for processed files
    let hash = crypto
      .createHash('md5')
      .update(filePostfix)
      .digest('hex');
    let pdfFile = `Render-${hash}.pdf`;
    let fileTemplatePath = path.join(tempReport, `Template-${hash}.docx`);
    let fileRenderPath = path.join(tempReport, `Render-${hash}.docx`);
    try {
      data.pageBreak = '<w:p><w:br w:type="page" /></w:p>';
      // XML syntax for Word page break
      // const pageBreak = '<w:p><w:br w:type="page" /></w:p>';
      // Validate input data
      if (typeof data !== 'object') {
        throw new Error('Unparseable input data');
      }

      // Check template's path
      if (!fs.existsSync(fileTemplatePath)) {
        // The template is not cached in this machine, implying first time caller
        // Find the template's identity in database
        let templateModelObj = Reportengine.app.models[templateModel];

        // Throw error if the template is not found in the database
        let templateModelRecord;
        try {
          templateModelRecord = await templateModelObj.findById(templateId);
        } catch (err) {
          throw new Error(`Error: Cannot find the template of ID ${templateId}`);
        }

        // Extract the filename out of its path
        let fileAwsName = templateModelRecord.data.url;
        fileAwsName = path.basename(fileAwsName);

        // Download the template file from AWS's S3
        let fileModelObj = Reportengine.app.models[fileModel];
        let awsStream = await fileModelObj.downloadStream(null, fileAwsName);

        // Save the file to temporary storage
        await Reportengine.streamToFile(awsStream, fileTemplatePath);
        await delay(1000);
      }

      // Read the template
      let templateContent = fs.readFileSync(fileTemplatePath, 'binary');
      var imageModule = new ImageModule(imageOptions);

      // Bind data from client's input to the template
      var zip = new JSZip(templateContent);

      var docx = new Docxtemplater()
        .attachModule(imageModule)
        .loadZip(zip)
        .setOptions({ parser: angularParser })
        .setData(data)
        .render();
      // Bundle the XMLs
      var buf = docx.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });

      // Write the file to designated path
      fs.writeFileSync(fileRenderPath, buf);
      // console.log('fileRenderPath', fileRenderPath);
      // Convert to PDF format
      // Asynchronously convert the .docx file to .pdf
      let pdfFile = await libreoffice.convert(fileRenderPath, tempReport, fileExt, null);
      let retry = 4;
      while (retry > 0) {
        let check = fs.existsSync(path.join(tempReport, pdfFile));
        if (check) {
          return pdfFile;
        }
        await delay(1000);
        retry--;
      }
    } catch (err) {
      // Return empty object if converted output is empty
      await delay(1000);
      if (fs.existsSync(path.join(tempReport, pdfFile))) {
        return pdfFile;
      }
      throw err;
    }
  };

  Reportengine.pregenNoLimit = async (
    templateData = {},
    filter = {},
    model = '',
    remoteMethod = '',
    templateId = '',
    templateModel = 'CtmTemplate',
    fileModel = 'CtmFile',
  ) => {
    let fileExt = 'pdf';
    let current = moment();
    let tempReport = Reportengine.app.dirs.tempReport;
    let filePostfix = current.format('YYYYMMDDHHmmssSSS');
    // Create hash for processed files
    let hash = crypto
      .createHash('md5')
      .update(filePostfix)
      .digest('hex');
    let pdfFile = `Render-${hash}.pdf`;
    let fileTemplatePath = path.join(tempReport, `Template-${hash}.docx`);
    let fileRenderPath = path.join(tempReport, `Render-${hash}.docx`);
    const modelInstance = Reportengine.app.models[model];
    templateData.data = await modelInstance[remoteMethod](filter);
    if (templateData.alert) {
      templateData.data.forEach(item => {
        item.logTime = moment(item.logTime).format('DD-MM-YYYY HH:mm');
        item.alert = templateData.alert[item.alert - 1];
      });
    }
    // console.log('TemplateData', templateData);
    try {
      templateData.pageBreak = '<w:p><w:br w:type="page" /></w:p>';
      // XML syntax for Word page break
      // const pageBreak = '<w:p><w:br w:type="page" /></w:p>';
      // Validate input data
      if (typeof templateData !== 'object') {
        throw new Error('Unparseable input data');
      }

      // Check template's path
      if (!fs.existsSync(fileTemplatePath)) {
        // The template is not cached in this machine, implying first time caller
        // Find the template's identity in database
        let templateModelObj = Reportengine.app.models[templateModel];

        // Throw error if the template is not found in the database
        let templateModelRecord;
        try {
          templateModelRecord = await templateModelObj.findById(templateId);
        } catch (err) {
          throw new Error(`Error: Cannot find the template of ID ${templateId}`);
        }

        // Extract the filename out of its path
        let fileAwsName = templateModelRecord.data.url;
        fileAwsName = path.basename(fileAwsName);

        // Download the template file from AWS's S3
        let fileModelObj = Reportengine.app.models[fileModel];
        let awsStream = await fileModelObj.downloadStream(null, fileAwsName);

        // Save the file to temporary storage
        await Reportengine.streamToFile(awsStream, fileTemplatePath);
        await delay(1000);
      }

      // Read the template
      let templateContent = fs.readFileSync(fileTemplatePath, 'binary');
      var imageModule = new ImageModule(imageOptions);

      // Bind data from client's input to the template
      var zip = new JSZip(templateContent);

      var docx = new Docxtemplater()
        .attachModule(imageModule)
        .loadZip(zip)
        .setOptions({ parser: angularParser })
        .setData(templateData)
        .render();
      // Bundle the XMLs
      var buf = docx.getZip().generate({ type: 'nodebuffer', compression: 'DEFLATE' });

      // Write the file to designated path
      fs.writeFileSync(fileRenderPath, buf);
      // console.log('fileRenderPath', fileRenderPath);
      // Convert to PDF format
      // Asynchronously convert the .docx file to .pdf
      let pdfFile = await libreoffice.convert(fileRenderPath, tempReport, fileExt, null);
      let retry = 4;
      while (retry > 0) {
        let check = fs.existsSync(path.join(tempReport, pdfFile));
        if (check) {
          return pdfFile;
        }
        await delay(1000);
        retry--;
      }
    } catch (err) {
      // Return empty object if converted output is empty
      await delay(1000);
      if (fs.existsSync(path.join(tempReport, pdfFile))) {
        return pdfFile;
      }
      throw err;
    }
  };

  Reportengine.generatePDFnoLimit = async (
    templateData,
    templateId,
    templateModel,
    fileModel,
    filter,
    model,
    remoteMethod,
  ) => {
    // The conversion process yields output
    let { limit, skip } = filter;
    if (!limit) filter.limit = Reportengine.app.get('maximumPrint'); // Get full records
    if (!skip) filter.skip = 0;
    const fileName = await Reportengine.pregenNoLimit(
      templateData,
      filter,
      model,
      remoteMethod,
      templateId,
      templateModel,
      fileModel,
    );

    if (!fileName) {
      throw new Error('Unkown error!');
    }
    // Set up the PDF file
    const filename = path.basename(fileName);
    return filename;
  };

  Reportengine.generatePDF = async (data, templateId, templateModel, fileModel) => {
    // The conversion process yields output
    const fileName = await Reportengine.pregen(data, templateId, templateModel, fileModel);

    if (!fileName) {
      throw new Error('Unkown error!');
    }
    // Set up the PDF file
    const filename = path.basename(fileName);
    return filename;
  };

  Reportengine.remoteMethod('generatePDF', {
    isStatic: true,
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'templateId', type: 'string' },
      { arg: 'templateModel', type: 'string' },
      { arg: 'fileModel', type: 'string' },
    ],
    returns: [{ arg: 'url', type: 'string', root: true }],
  });

  Reportengine.remoteMethod('generatePDFnoLimit', {
    isStatic: true,
    accepts: [
      { arg: 'data', type: 'object' },
      { arg: 'templateId', type: 'string' },
      { arg: 'templateModel', type: 'string' },
      { arg: 'fileModel', type: 'string' },
      { arg: 'filter', type: 'object' },
      { arg: 'model', type: 'string' },
      { arg: 'remoteMethod', type: 'string' },
    ],
    returns: [{ arg: 'url', type: 'string', root: true }],
  });
};

/*

Reportengine.generatePDF = async (
    data = {},
    templateId = '',
    templateModel = 'CtmTemplate',
    fileModel = 'CtmFile',
) => {
    // The conversion process yields output
    const fileName = await Reportengine.pregen(data, templateId, templateModel, fileModel);
    if (!fileName) {
        throw new Error('Unkown error!');
    }
    // Set up the PDF file
    const filename = path.basename(fileName);
    return filename;
};
*/
