'use strict';
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
// const moment = require('moment-timezone');

module.exports = ReportEngine => {
  ReportEngine.generateWaterShutoffNotice = async (clientId, clientCode) => {
    // Validate presences of clientId or clientCode
    if (!clientId || !clientCode) {
      throw new Error('No client identity to generate water shutoff notice for!');
    }

    // Get debt data from clientMeter
    const ClientMeterNumber = ReportEngine.app.models.ClientMeterNumber;
    const clientDebtData = await ClientMeterNumber.find({ where: { and: [{ clientId }, { paymentStatus: false }] } });

    // Process possible scenarios
    // Request client has no debt => throw error since client-side would have
    if (!clientDebtData || clientDebtData.length === 0) {
      throw new Error(`Client of ID ${clientId} is not indebted!`);
    }
    // Request client has debt
    // const currentDate = moment();
    // const data = {
    //   clients: clientDebtData,
    //   noticePublishDay: currentDate.date(),
    //   noticePublishMonth: currentDate.month(),
    //   noticePublishYear: currentDate.year(),
    // };
    //
  };
};

// Get data to fill into template

// Set up Puppeteer

// Read template' content
const templatePath = path.resolve(__dirname, '../templating/templates/waterShutoffNotice.hbs');
const templateContent = fs.readFileSync(templatePath, 'utf-8');

// Bind to Handlebars engine
const precompiledTemplate = Handlebars.compile(templateContent, { strict: true });

// Compile bounded template with sample data
const compiledHTML = precompiledTemplate({});

// Store one version of HTML and one version of PDF
fs.writeFileSync('test-water-shutoff-notice.html', compiledHTML);

// Close Puppeteer
