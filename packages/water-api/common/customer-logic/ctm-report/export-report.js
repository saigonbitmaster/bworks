module.exports = CtmReport => {
  CtmReport.exportReport = (apis, templateId, filter, res, callback) => {
    // Save the bloody conditions that lead to generation of data
    CtmReport.cacheMetadata('', filter)
      .then(metadataId =>
        // Process fetched data to suit with acquire template
        Promise.all([metadataId, CtmReport.processData(templateId, metadataId, apis, filter, res)]),
      )
      .then(([metadataId, processedData]) => {
        // Bind data with template
        // Generate the compiled report
        return CtmReport.generateReport(templateId, metadataId, processedData);
      }) //
      .then(compiledReportName => {
        // Download the stream
        const stream = CtmReport.app.models.CtmReportFile.downloadStream('CtmReportFiles', compiledReportName);
        // Serve the stream back to client
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename=${compiledReportName}`;
        return callback(null, stream, contentType, contentDisposition);
      })
      .catch(err => callback(err));
  };

  CtmReport.remoteMethod('exportReport', {
    accepts: [
      { arg: 'apis', type: ['object'] },
      { arg: 'templateId', type: 'string' },
      { arg: 'filter', type: 'object' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
