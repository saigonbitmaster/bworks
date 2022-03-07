const hasIn = require('lodash/hasIn');
const createError = require('http-errors');

module.exports = CtmReport => {
  CtmReport.processData = async (templateId, metadataId, apis, filter, res) => {
    // Remove the suffix 'Report'
    const templateName = templateId.endsWith('Report')
      ? templateId.slice(0, templateId.lastIndexOf('Report'))
      : templateId;
    // Check if there is a remote method responsible for process this kind
    // of data
    if (hasIn(CtmReport, `process${templateName}Data`)) {
      return await CtmReport[`process${templateName}Data`](metadataId, apis, filter, res);
    } else {
      throw createError(500, 'error.APPRORIATE_PROCESSING_METHOD_NOT_AVAILABLE');
    }
  };

  CtmReport.remoteMethod('processData', {
    accepts: [
      { arg: 'templateId', type: 'string' },
      { arg: 'metadataId', type: 'string' },
      { arg: 'apis', type: ['object'] },
      { arg: 'filter', type: 'object' },
    ],
    returns: { arg: 'processData', type: 'object', root: 'true' },
  });
};
