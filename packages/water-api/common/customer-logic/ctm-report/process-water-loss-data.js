const omit = require('lodash/omit');
const has = require('lodash/has');
const { getTime, getFormattedNumber, getCompanyLogoImage } = require('./utils');

module.exports = CtmReport => {
  CtmReport.processWaterLossData = async (metadataId, apis, filter, res) => {
    // FETCHING
    const rawData = { time: filter.where.time };

    for (let { model, method } of apis) {
      let fetchedData = null;
      if (has(filter.where, 'flgTotal')) {
        fetchedData = await CtmReport.app.models[model][method](filter, res);
        rawData.dmas = fetchedData;
        fetchedData = await CtmReport.app.models[model][method](
          { ...filter, where: omit(filter.where, 'flgGetFull') },
          res,
        );
        rawData.summary = fetchedData;
      }
    }

    // SAVING METADATA
    await CtmReport.cacheMetadata(metadataId, { apis });

    // PROCESSING
    const processedData = { date: {} };

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

    // Add summary statistics
    processedData.sumWaterLoss = rawData.summary.sumLoss ? getFormattedNumber(rawData.summary.sumLoss) : 0;
    processedData.sumRateWaterLoss = rawData.summary.sumRateLoss ? getFormattedNumber(rawData.summary.sumRateLoss) : 0;

    // Add dmas
    processedData.dmas = rawData.dmas.map(({ dma, totalSupply, totalWaterUsage, totalLoss, rateLoss }) => ({
      dma,
      totalSupply: getFormattedNumber(totalSupply),
      totalWaterUsage: getFormattedNumber(totalWaterUsage),
      totalLoss: getFormattedNumber(totalLoss),
      rateLoss: getFormattedNumber(rateLoss),
    }));

    // Return
    return processedData;
  };
};
