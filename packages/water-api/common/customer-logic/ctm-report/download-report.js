module.exports = CtmReport => {
  CtmReport.downloadReport = (reportName, callback) => {
    const CtmReportFile = CtmReport.app.models.CtmReportFile;
    // Attempt to download requested report
    CtmReportFile.downloadStream(null, reportName)
      .then(stream => {
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename=${reportName}`;
        return callback(null, stream, contentType, contentDisposition);
      })
      .catch(err => {
        // Either the request report hasn't been made yet
        // Or there are errors appeared in the downloading process
        return callback(err.message);
      });
  };

  CtmReport.remoteMethod('downloadReport', {
    isStatic: true,
    accepts: { arg: 'reportName' },
    http: { verb: 'get' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};
