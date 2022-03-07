const path = require('path');
const crypto = require('crypto');
const createError = require('http-errors');
const handlebars = require('handlebars');
const moment = require('moment');
const puppeteer = require('puppeteer');
const get = require('lodash/get');

// Write Stream to String
const streamToString = stream =>
  new Promise((resolve, reject) => {
    let stringifiedStream = '';
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => {
      stringifiedStream = Buffer.concat(chunks);
      resolve(stringifiedStream);
    });
    stream.on('error', err => reject(err));
  });

// Convert a Handlebar compiled template to PDF
const convertHTMLToPDF = async compiledHtml => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROME_BIN,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setContent(compiledHtml);
  const options = {
    landscape: true,
    printBackground: true,
    format: 'A4',
  };
  return page.pdf(options);
};

// Convert a Buffer to Stream
const bufferToStream = buffer => {
  const Readable = require('stream').Readable;
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

// Asynchronously upload a Stream to Amazon S3
const uploadToS3 = (bucket, filename, stream, model) =>
  new Promise((resolve, reject) => {
    const CtmReportFile = model.app.models.CtmReportFile;
    const uploadStream = CtmReportFile.uploadStream(bucket, filename);
    uploadStream.on('success', result => resolve(result));
    uploadStream.on('error', err => reject(err));
    stream.pipe(uploadStream);
  });

module.exports = CtmReport => {
  CtmReport.generateReport = async (templateId, metadataId, data) => {
    const CtmFile = CtmReport.app.models.CtmFile;

    // Get the template object
    const templateObject = await CtmReport.app.models.CtmTemplate.findById(templateId);
    console.log(templateObject, JSON.stringify(templateObject))
    if (!templateObject) {
      throw createError(400, 'TEMPLATE_NOT_FOUND');
    }
    // Get the URL
    const templateS3URL = path.basename(templateObject.data.url);
    // Check the file's extension
    const templateExtension = path.extname(templateS3URL);
    if (templateExtension.match('docx')) {
      throw createError(400, 'error.INAPPRORIATE_FILE_EXTENSION');
    } else if (templateExtension.match('hbs')) {
      // Download template, wrapped in a Stream
      const templateStream = await CtmFile.downloadStream(null, templateS3URL);
      // Write the Stream into a String
      const template = await streamToString(templateStream);

      // Name for report on S3
      const reportName = crypto
        .createHash('md5')
        .update(
          moment()
            .toDate()
            .toString(),
        )
        .digest('hex');
      const reportFullName = `CtmReportFiles/${reportName}.pdf`;

      // Fill template with data
      // Use strict mode so that Handlebars will throw exceptions if we
      // attempt to use fields in our template that are not in our dataset
      const precompiledTemplate = handlebars.compile(template.toString(), { strict: true });
      let compiledTemplate = null;
      try {
        compiledTemplate = precompiledTemplate(data);
      } catch (err) {
        throw createError(400, 'MISMATCHES_BETWEEN_DATA_AND_TEMPLATE');
      }

      // Convert to PDF
      const convertedCompiledTemplate = await convertHTMLToPDF(compiledTemplate);

      // Convert PDF file from Buffer to Stream
      const convertedCompiledTemplateStream = bufferToStream(convertedCompiledTemplate);

      // Upload to Amazon S3
      const bucket = CtmReport.app.models.CtmReportFile.dataSource.settings.bucket;
      const uploadResult = await uploadToS3(bucket, reportFullName, convertedCompiledTemplateStream, CtmReport);

      // Retrieve the URL
      const url = get(uploadResult, 'location');

      // Cache relevant metadata
      const input = {
        name: reportFullName,
        templateId,
        url,
      };
      await CtmReport.cacheMetadata(metadataId, input);

      // Return the report's name
      return `${reportName}.pdf`;
    } else {
      throw createError(400, 'error.INVALID_FILE_TYPE');
    }
  };

  CtmReport.remoteMethod('generateReport', {
    accepts: [
      { arg: 'templateId', type: 'string' },
      { arg: 'metadataId', type: 'string' },
      { arg: 'data', type: 'object' },
    ],
    http: { verb: 'post' },
    returns: { arg: 'reportName', type: 'string', root: 'true' },
  });
};
