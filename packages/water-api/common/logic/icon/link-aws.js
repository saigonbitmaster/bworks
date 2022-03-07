'use strict';
const svg2png = require('svg2png');
const toStream = require('buffer-to-stream');
const createError = require('http-errors');

module.exports = function(Icon) {
  Icon.linkAws = async (name, size = 24, status = 'normal') => {
    try {
      // get local data
      let localIcon = await Icon.getDropIcon(name, size, 'normal');
      if (!localIcon) return '';
      const { name: fixName, size: fixSize } = localIcon;
      // check current
      const type = 'Aws';
      const id = `${type}-${fixName}-${fixSize}-${status}`;
      let current = await Icon.findById(id);
      if (!current) {
        // upload to aws
        // upload kml to s3
        let url = await new Promise((resolve, reject) => {
          let bucket = Icon.app.models.NmsFile.dataSource.settings.bucket;
          let writeStream = Icon.app.models.NmsFile.uploadStream(bucket, `NmsFiles/Icons/${id}.png`, {
            prefix: 'NmsFile',
            acl: 'public-read',
            contentType: 'image/png',
            lastModified: localIcon.updatedDate,
          });
          writeStream.on('success', data => {
            resolve(data.location);
          });
          writeStream.on('error', error => reject(error));
          let buffer = Buffer.from(localIcon.data, 'utf8');
          svg2png(buffer, { width: size, height: size }).then(pngBuffer => {
            let pngStream = toStream(pngBuffer);
            pngStream.pipe(writeStream);
          });
        });
        // save
        let record = await Icon.updateOrCreate({ id, type, name: fixName, color: status, size: fixSize, data: url });
        return record.data;
      }
      return current.data;
    } catch (e) {
      // createE
      throw createError(400, 'error.NOT_FOUND');
    }
  };

  Icon.remoteMethod('linkAws', {
    isStatic: true,
    accepts: [
      { arg: 'name', type: 'string', default: '' },
      { arg: 'size', type: 'number', default: 24 },
      { arg: 'status', type: 'string', default: 'normal' },
    ],
    http: { verb: 'get', path: '/linkAws/:name' },
    returns: { arg: 'body', type: 'string', root: true },
  });
};
