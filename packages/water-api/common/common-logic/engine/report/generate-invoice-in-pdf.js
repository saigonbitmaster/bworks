'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const puppeteer = require('puppeteer');
const moment = require('moment-timezone');
const delay = require('delay');
const clone = require('lodash/clone');
const set = require('lodash/set');
const numeral = require('numeral');

module.exports = ReportEngine => {
  // Traverse every fields of an object and
  const traverseObject = (object, mapper) => {
    if (!typeof object !== 'object' && !object.constructor === Object) {
      throw new Error('Given argument is not of Object type!');
    }
    const recursiveObjectWalker = (subObject, path = '', subMapper) => {
      if (typeof subObject !== 'object') {
        const pathWithoutLastDot = path.lastIndexOf('.') === path.length - 1 ? path.slice(0, path.length - 1) : path;
        set(object, pathWithoutLastDot, subMapper(subObject));
      } else if (Array.isArray(subObject)) {
        const objectLength = subObject.length;
        for (let index = 0; index < objectLength; index++) {
          recursiveObjectWalker(subObject[index], path.concat(index.toString()).concat('.'), subMapper);
        }
      } else if (object.constructor === Object) {
        const objectKeys = Object.keys(subObject);
        for (let key of objectKeys) {
          recursiveObjectWalker(subObject[key], path.concat(key).concat('.'), subMapper);
        }
      } else {
        throw new Error('Entity of unwanted type!');
      }
    };

    recursiveObjectWalker(object, '', mapper);

    return object;
  };

  // transform values to correct format (add commas to decimal numbers, ...)
  const addNumeralSeparator = value => {
    if (parseInt(value).toString() === JSON.stringify(value) && JSON.stringify(value) !== 0) {
      return numeral(value).format();
    }
    return value;
  };

  // Add default values to some of the data
  const addDefaultValues = data => {
    if (typeof data === 'object') {
      let newData = data;
      try {
        newData = clone(data);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }

      // Add default values directly for non-nested fields
      const defaultValues = {
        invoiceSerial: '01GTKT2/001',
        invoiceSerialSymbol: 'AC/18P',
        invoiceId: newData.invoiceNo,
      };
      newData = { ...newData, ...defaultValues };

      // Set default value for some nested fields
      set(newData, 'client.taxNo', '');
      return newData;
    } else {
      throw new Error(`Given argument is not an Object!`);
    }
  };

  ReportEngine.generateInvoiceInPDF = async (
    data = {},
    templateId = '',
    templateModel = 'CtmTemplate',
    fileModel = 'CtmFile',
  ) => {
    let current = moment();
    let tempReport = ReportEngine.app.dirs.tempReport;
    let filePostfix = current.format('YYYYMMDDHHmmssSSS');

    // Create hash for processed files
    let hash = crypto
      .createHash('md5')
      .update(filePostfix)
      .digest('hex');
    let fileTemplatePath = path.join(tempReport, `Template-${hash}.hbs`);
    let fileRenderName = `Render-${hash}-final.pdf`;
    let fileRenderPath = path.join(tempReport, fileRenderName);

    // Check template's path
    if (!fs.existsSync(fileTemplatePath)) {
      // The template is not cached in this machine, implying first time caller
      // Find the template's identity in database
      let templateModelObj = ReportEngine.app.models[templateModel];

      // Throw error if the template is not found in the database
      let templateModelRecord;
      try {
        templateModelRecord = await templateModelObj.findById(templateId);
        if (!templateModelRecord) {
          throw new Error();
        }
      } catch (err) {
        throw new Error(`Error: Cannot find the template of ID ${templateId}`);
      }

      // Extract the filename out of its path
      let fileAwsName = templateModelRecord.data.url;
      fileAwsName = path.basename(fileAwsName);

      // Download the template file from AWS's S3
      let fileModelObj = ReportEngine.app.models[fileModel];
      let awsStream = await fileModelObj.downloadStream(null, fileAwsName);

      // Save the template to temporary storage
      await ReportEngine.streamToFile(awsStream, fileTemplatePath);
      await delay(1000);
    }

    // Read the template
    let templateContent = fs.readFileSync(fileTemplatePath, 'utf-8');

    // Bind the template to Handlebar main function
    const boundTemplate = handlebars.compile(templateContent);

    // Setup Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    const options = {
      landscape: true,
      printBackground: true,
      format: 'A5',
    };

    const processedInvoiceData = {
      invoices: data.invoices.map(invoices => {
        // Add some default values
        const invoice = addDefaultValues(invoices);

        // Reformat numeric values with decimal comma or dot
        traverseObject(invoice, addNumeralSeparator);

        // Reformat phone number
        if (invoice.company && invoice.company.phone) {
          invoice.company.phone = invoice.company.phone.toString().replace(/,|\./g, '');
        }

        // Return
        return invoice;
      }),
    };

    // Bind data to bounded template
    const compiledTemplate = boundTemplate(processedInvoiceData);

    await page.setContent(compiledTemplate);

    const pdf = await page.pdf(options);

    // Save constituent PDF to temporary directory
    fs.writeFileSync(fileRenderPath, pdf);

    // Close the Chromium instance
    browser.close();

    // Return the filename
    return fileRenderName;
  };
};
