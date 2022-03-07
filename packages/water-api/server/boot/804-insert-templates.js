'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const { hashFileName } = require('loopback-storage-aws/lib/storage-handler');
const allowedCtmTemplates = require('../../common/customer-models/ctm-template.json').properties.id.enum;

/* eslint-disable no-console */
module.exports = async app => {
  const CtmTemplate = app.models.CtmTemplate;
  const CtmFile = app.models.CtmFile;
  const bucket = CtmFile.dataSource.settings.bucket;

  const S3_PREFIX = 'CtmFiles';

  const uploadToS3 = async (filePath, fileName) => {
    return new Promise((resolve, reject) => {
      const hashedFilename = hashFileName(null, fileName);
      const writeStream = CtmFile.uploadStream(bucket, `${S3_PREFIX}/${hashedFilename}`, {
        prefix: 'CtmFile',
        // acl: 'public-read',
        lastModified: new Date(),
        expires: moment()
          .add(1, 'year')
          .toDate(),
      });
      writeStream.on('success', data => {
        resolve(data.name);
      });
      writeStream.on('error', error => reject(error));
      let fileStream = fs.createReadStream(filePath);
      fileStream.pipe(writeStream);
    });
  };

  // Check if the templates are present in assumed directory
  const templateDirectoryPath = path.resolve(__dirname, '../../common/common-logic/engine/templating/templates');
  const templates = fs.readdirSync(templateDirectoryPath);
  if (!templates.some(template => template.endsWith('.hbs'))) {
    throw Error('No available report templates!');
  }

  // Data for 12 report templates
  const data = {
    MonthlyMeterNumberReport: 'waterStationResultTemplate.hbs',
    ClientLossReport: 'reportRevenueLossClient.hbs',
    IncomeReport: 'reportIncome.hbs',
    WaterLossReport: 'reportWaterLoss.hbs',
    RevenueLossReport: 'reportRevenueLoss.hbs',
    DebtClientByGeoReport: 'reportDebtClientByGeo.hbs',
    DebtClientByProviderReport: 'reportDebtClientByProvider.hbs',
    QuantityClientByGeoReport: 'reportQuantityClientByGeo.hbs',
    QuantityClientByProviderReport: 'reportQuantityClientByProvider.hbs',
    ClientMeterReport: 'reportClientMeter.hbs',
    // 'ClientInvoice.hbs': 'invoice.hbs',
    // Template for performant invoice
    // 'ClientInvoiceDataOnly.hbs': 'invoice-performant.hbs',
  };
  const templateIds = Object.keys(data);

  for (let templateId of templateIds) {
    // If a template is not allowed config-wise
    if (!allowedCtmTemplates.includes(templateId)) {
      continue;
    }

    const templateName = data[templateId];
    const templateFilepath = path.join(templateDirectoryPath, templateName);
    // Check if these exist in database,
    const templateAlreadyExisted = await CtmTemplate.exists(templateId);
    if (!templateAlreadyExisted) {
      // If not, upload these files and insert into database
      const uploadResult = await uploadToS3(templateFilepath, templateName);
      const S3TemplateName = path.basename(uploadResult);
      const persistedData = {
        id: templateId,
        data: {
          name: data[templateId],
          url: `/api/CtmFiles/download/${S3TemplateName}`,
        },
      };
      await CtmTemplate.create(persistedData);
      console.log(`Insert template ${templateId}!`);
    }
  }
};
