const omit = require('lodash/omit');
const has = require('lodash/has');
const { getTime, getFormattedNumber, getTranslatedTerm, getCompanyLogoImage } = require('./utils');

module.exports = CtmReport => {
  CtmReport.processDebtClientByProviderData = async (metadataId, apis, filter, res) => {
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
        rawData.clients = fetchedData;
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
    processedData.sumTotalDebt = rawData.summary.totalDebt ? getFormattedNumber(rawData.summary.totalDebt) : 0;

    // Add clients
    processedData.clients = rawData.clients.map(({ code, name, formattedAddress, provider, debt, status }) => ({
      code,
      name,
      formattedAddress,
      provider,
      debt: getFormattedNumber(debt),
      status: getTranslatedTerm(`client.statusChoices.${status.toLowerCase()}`),
    }));

    // Return
    return processedData;
  };
};
