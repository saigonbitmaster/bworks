const isEmpty = require('lodash/isEmpty');
const createError = require('http-errors');
const omit = require('lodash/omit');
const intersection = require('lodash/intersection');
const has = require('lodash/has');
const { getTime, getGeo, getCompanyLogoImage, getFormattedNumber } = require('./utils');

module.exports = CtmReport => {
  CtmReport.processQuantityClientByGeoData = async (metadataId, apis, filter, res) => {
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
        rawData.statistics = fetchedData;
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

    // Add summary statistics
    processedData.sumTotalClient = rawData.summary.totalClient ? getFormattedNumber(rawData.summary.totalClient) : 0;

    // Add individual statistics
    processedData.statistics = rawData.statistics.map(stat => {
      const { activeClient, pauseClient, stopClient, totalClient } = stat;
      let geo = null;
      const intersectioned = intersection(Object.keys(stat), ['district', 'province', 'ward']);
      if (intersectioned.length > 0) {
        geo = stat[intersectioned];
      }

      if (!geo) {
        throw createError(500, 'error.FOREIGN_STRING_ENTITY');
      }

      return {
        geo,
        activeClient: getFormattedNumber(activeClient),
        pauseClient: getFormattedNumber(pauseClient),
        stopClient: getFormattedNumber(stopClient),
        totalClient: getFormattedNumber(totalClient),
      };
    });

    // Return
    return processedData;
  };
};
