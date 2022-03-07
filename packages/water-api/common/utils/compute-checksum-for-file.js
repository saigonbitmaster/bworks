const crypto = require('crypto');
const fs = require('fs');

const computeChecksumForFile = filename =>
  new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filename);
    const hash = crypto.createHash('md5');
    fileStream.on('data', data => hash.update(data, 'utf8'));
    fileStream.on('end', () => {
      const hashName = crypto.createHash('md5');
      const result = hashName.update(hash.digest('hex') + filename, 'utf8').digest('hex');
      resolve(result);
    });
    fileStream.on('error', err => reject(err));
  });

module.exports = computeChecksumForFile;
