const fs = require('fs');
const path = require('path');

module.exports = function(Pdfgetter) {
  // Check the file and return if it exists, else emitting error
  const getFile = async filename => {
    if (typeof filename !== 'string') {
      throw new Error('Unknown the file name ' + filename);
    }
    const tempReport = Pdfgetter.app.dirs.tempReport;
    const absolutePath = path.join(tempReport, filename);

    if (fs.existsSync(absolutePath)) {
      let downloadStream = fs.createReadStream(absolutePath);
      return downloadStream;
    }
    throw new Error('File not found! ' + filename);
  };

  // Remote method for getitng the filepath
  Pdfgetter.getPDF = (filepath, callback) => {
    getFile(filepath)
      .then(stream => {
        if (!stream) {
          return callback('The file does not exist');
        }
        const contentType = 'application/pdf';
        const contentDisposition = `inline; filename="${filepath}"`;
        callback(null, stream, contentType, contentDisposition);
      })
      .catch(err => {
        callback(err);
      });
  };

  // Register remote method(s)
  Pdfgetter.remoteMethod('getPDF', {
    isStatic: true,
    http: { verb: 'get' },
    accepts: [{ arg: 'filename', type: 'string' }],
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Content-Disposition', type: 'string', http: { target: 'header' } },
    ],
  });
};

// Example
// Replace the filepath with another filepath on your computer to execute the module
// exports
//   .getFile('/Users/setfil/Project/water/packages/water-api/temp/Render-db3e1d64b40636340ed5f626787226a0.docx')
//   .then(file => {
//     const hash = crypto.createHash('md5');
//     file.on('data', chunk => hash.update(chunk));
//     file.on('end', () => console.log(hash.digest('hex')));
//   });
