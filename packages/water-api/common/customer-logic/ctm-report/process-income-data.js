const isEmpty = require('lodash/isEmpty');
const createError = require('http-errors');
const omit = require('lodash/omit');
const intersection = require('lodash/intersection');
const has = require('lodash/has');
const { getTime, getGeo, getCompanyLogoImage, getFormattedNumber, getTranslatedTerm } = require('./utils');

module.exports = CtmReport => {
  CtmReport.processIncomeData = async (metadataId, apis, filter, res) => {
    // FETCHING
    const rawData = { time: filter.where.time };

    for (let { model, method } of apis) {
      let fetchedData = null;
      if (has(filter.where, 'flgTotal')) {
        fetchedData = await CtmReport.app.models[model][method](
          { ...filter, where: omit(filter.where, 'flgGetFull') },
          res,
        );
        rawData.summary = fetchedData;
        fetchedData = await CtmReport.app.models[model][method](
          { ...filter, where: omit(filter.where, 'flgTotal') },
          res,
        );
        rawData.incomes = fetchedData;
      }
    }

    // SAVING METADATA
    await CtmReport.cacheMetadata(metadataId, { apis });

    // PROCESSING
    const processedData = { date: {}, geo: '' };

    // Parse date
    const parsedDate = getTime(rawData.time);
    // Add date
    processedData.date.month = parsedDate.date.month;
    processedData.date.year = parsedDate.date.year;

    // Add company's logo
    const logo = getCompanyLogoImage();
    processedData.logo = logo;

    // Add company's name
    processedData.companyName = await CtmReport.app.models.OrgConfig.findById('config').then(config =>
      config && config.companyName ? config.companyName : '',
    );

    // Get geo
    const retrievedGeo = await getGeo(CtmReport, filter.where);
    // Add geo
    if (!isEmpty(retrievedGeo) && Object.values(retrievedGeo).some(item => !isEmpty(item))) {
      processedData.geo = {};
      processedData.geo.province = retrievedGeo.province;
      processedData.geo.district = retrievedGeo.district;
      processedData.geo.ward = retrievedGeo.ward;
    }

    // Add statistics filter
    switch (filter.where.incomeBy) {
      case 'geo':
        processedData.incomeBy = 'Địa lý';
        break;
      case 'provider':
        processedData.incomeBy = 'Nhà cung cấp';
        break;
      case 'clientType':
        processedData.incomeBy = 'Loại khách hàng';
        break;
    }

    // Add summary statistics
    processedData.sumTotalWaterUsage = getFormattedNumber(rawData.summary.sumTotalWaterUsage);
    processedData.sumTotalInvoice = getFormattedNumber(rawData.summary.sumTotalInvoice);

    // Add incomes
    processedData.incomes = rawData.incomes.map(income => {
      const { totalWaterUsage, totalInvoice } = income;
      let incomeByData = null;
      const intersectioned = intersection(Object.keys(income), [
        'district',
        'province',
        'ward',
        'clientType',
        'provider',
      ]);
      if (intersectioned.length > 0) {
        incomeByData = income[intersectioned];
        if (intersectioned.includes('clientType')) {
          incomeByData = getTranslatedTerm(`client.clientTypeChoices.${incomeByData.toLowerCase()}`);
        }
      }

      if (!incomeByData) {
        throw createError(500, 'error.FOREIGN_STRING_ENTITY');
      }

      return {
        incomeByData,
        totalInvoice: getFormattedNumber(totalInvoice),
        totalWaterUsage: getFormattedNumber(totalWaterUsage),
      };
    });

    // Return
    return processedData;
  };
};
