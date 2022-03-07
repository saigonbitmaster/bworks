'use strict';
const path = require('path');
const exportWaterStationResultReport = require('../common-logic/engine/templating/controllers/waterStationResultReport');
const createError = require('http-errors');
// eslint-disable-next-line
module.exports = function(CtmTemplate) {
  exportWaterStationResultReport(CtmTemplate);
  CtmTemplate.getTemplateContent = async id => {
    const template = await CtmTemplate.findById(id);
    if (!template) {
      throw createError(400, `Template "${id}" not found`);
    }

    let fileAwsName = template.data.url;
    fileAwsName = path.basename(fileAwsName);
    const models = CtmTemplate.app.models;
    // Download the template file from AWS's S3
    let stream = await models.CtmFile.downloadStream(null, fileAwsName);
    const content = await new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    return { content };
  };
  CtmTemplate.remoteMethod('getTemplateContent', {
    accepts: [{ arg: 'id', type: 'string', required: true }],
    http: { verb: 'get' },
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  });
};
