const { getTime, getCompanyLogoImage, getFormattedNumber } = require('./utils');

module.exports = CtmReport => {
  CtmReport.processClientLossData = async (metadataId, apis, filter, res) => {
    // FETCHING
    const rawData = { time: filter.where.time };

    for (let { model, method } of apis) {
      let fetchedData = null;
      if (model === 'Client' && method === 'totalReportRevenueLossClient') {
        fetchedData = await CtmReport.app.models[model][method](filter.where, res);
      } else {
        fetchedData = await CtmReport.app.models[model][method](filter, res);
      }
      rawData[method] = fetchedData;
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

    // Add comma-delimited summary statistics
    processedData.sumWaterRevenueLoss = getFormattedNumber(rawData.totalReportRevenueLossClient.sumWaterRevenueLoss);
    processedData.sumInvoiceWaterRevenueLoss = getFormattedNumber(
      rawData.totalReportRevenueLossClient.sumInvoiceWaterRevenueLoss,
    );

    // Add clients
    processedData.clients = rawData.reportRevenueLossClient.map(
      ({ code, formattedAddress, name, totalInvoiceWaterRevenueLoss, totalWaterRevenueLoss }) => ({
        code,
        name,
        formattedAddress,
        totalWaterRevenueLoss: getFormattedNumber(totalWaterRevenueLoss),
        totalInvoiceWaterRevenueLoss: getFormattedNumber(totalInvoiceWaterRevenueLoss),
      }),
    );

    // Return
    return processedData;
  };
};
