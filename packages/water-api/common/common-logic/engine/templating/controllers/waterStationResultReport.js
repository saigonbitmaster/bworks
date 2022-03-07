const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const moment = require('moment');
const puppeteer = require('puppeteer');
const lodash = require('lodash');

// Convert a Handlebar compiled template to PDF
const convertHtmlToPdf = async compiledHtml => {
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

// Register block helpers
handlebars.registerHelper('getWaterStationStyled', data => {
  let result = data;
  if (
    data
      .toString()
      .toLowerCase()
      .includes('trạm')
  ) {
    result = `<span class="station">${data}</span>`;
  }
  return new handlebars.SafeString(result);
});

module.exports = Template => {
  Template.exportWaterStationReportResult = (date, callback) => {
    // Check if `views` directory has been created
    const viewsDirectoryFilePath = path.resolve(__dirname, '../views');
    if (!fs.existsSync(viewsDirectoryFilePath)) {
      fs.mkdirSync(viewsDirectoryFilePath);
    }
    const templateFilePath = path.resolve(__dirname, '../templates/waterStationResultTemplate.hbs');
    const generatedHtmlFilePath = path.resolve(__dirname, '../views/waterStationResultReport.html');
    const generatedReportFilePath = path.resolve(__dirname, '../views/waterStationResultReport.pdf');
    // Our data source
    Template.app.models.ExcelUtils.getWaterStationData(date)
      .then(data => {
        date = moment(date);

        const [waterStationData, totalSum] = [lodash.initial(data), lodash.last(data)];

        const newData = {
          waterStationData,
          // Add month and year to retrieved data
          date: {
            month: date.month() + 1,
            year: date.year(),
          },
          // Sum of statistics in all water stations
          totalSum,
        };
        // Our template
        const template = fs.readFileSync(templateFilePath, 'utf-8');

        // Use strict mode so that Handlebars will throw exceptions if we
        // attempt to use fields in our template that are not in our dataset
        const templateWithData = handlebars.compile(template, { strict: true });
        const compiledTemplate = templateWithData(newData);

        // Write the template in HTML form
        fs.writeFileSync(generatedHtmlFilePath, compiledTemplate);

        // Convert the compiled template to PDF
        return convertHtmlToPdf(compiledTemplate);
      })
      .then(pdf => {
        // Write the template into a HTML file
        fs.writeFileSync(generatedReportFilePath, pdf);

        // Create stream
        const generatedReportStream = fs.createReadStream(generatedReportFilePath);
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename=${path.basename(generatedReportFilePath)}`;
        return callback(null, generatedReportStream, contentType, contentDisposition);
      })
      .catch(err => callback(err));
  };
  Template.remoteMethod('exportWaterStationReportResult', {
    isStatic: true,
    accepts: {
      arg: 'date',
      type: 'string',
    },
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
