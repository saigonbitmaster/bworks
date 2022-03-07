'use strict';
const fs = require('fs');
const util = require('util');
const path = require('path');
const changeCase = require('change-case');
const str = require('string-to-stream');
const moment = require('moment-timezone');
const svg2png = require('svg2png');

module.exports = function(Icon) {
  Icon.getDropIcon = async (name, size = 36, status, color, format, modifiedSine) => {
    if (typeof modifiedSine === 'string') {
      modifiedSine = new Date(modifiedSine);
    }
    color = status || color || 'normal';
    if (size < 8) {
      size = 8;
    } else if (size > 128) {
      size = 128;
    }
    if (size % 2 !== 0) {
      size = parseInt(size / 2) * 2;
    }
    let type = 'LocalDrop';
    let fixName = changeCase.snakeCase(name);
    let id = `${type}-${fixName}-${size}-${color}-${format}`;
    // get current
    let current = await Icon.findById(id);
    if (current) {
      if (
        modifiedSine &&
        modifiedSine !== 'modifiedSine' &&
        moment(modifiedSine).isValid() &&
        moment(current.updatedDate).diff(moment(modifiedSine)) >= 0
      ) {
        current.cache = true; //cache
        return current;
      }
      return current;
    }
    let dropIcon = await Icon.getIcon('DropIcon', color, 24); // fix size 24
    let insideIcon = await Icon.getIcon(name, 'white', 12); // fix size 12
    let insideIconContent = insideIcon.data.replace(/<svg/g, math => {
      return math + ' x="6" y="4"';
    });
    let template = fs.readFileSync(`${__dirname}/svgs/drop-svg-template.txt`, 'utf8');
    // parent drop with dynamic size
    if (size !== 24) {
      template = template.replace(/<svg(.*?)>/g, math => {
        let fix = math.replace(' width="24"', ` width="${size}"`);
        fix = fix.replace(' height="24"', ` height="${size}"`);
        return fix;
      });
    }
    // merge svg
    template = util.format(template, dropIcon.data, insideIconContent);

    if (format === 'png') {
      template = await new Promise((resolve, reject) => {
        let buffer = Buffer.from(template, 'utf8');
        svg2png(buffer, { width: size, height: size }).then(pngBuffer => {
          const folder = Icon.app.dirs.tempIcon;
          const filePath = path.join(folder, `${id}.${format}`);
          fs.writeFile(filePath, pngBuffer, 'binary', err => {
            if (err) return reject(err);
            resolve(filePath);
          });
        });
      });
    }
    // insert to db
    return Icon.updateOrCreate({
      id,
      type: 'Local',
      name: fixName,
      color,
      size,
      data: template,
      updatedDate: new Date(),
    });
  };

  Icon.dropView = (name, size = 36, status, color, format, modifiedSine, res, cb) => {
    format = format || 'svg';
    Icon.getDropIcon(name, size, status, color, format, modifiedSine)
      .then(record => {
        const { data, updatedDate, cache } = record;
        let conentType = format === 'png' ? 'image/png' : 'image/svg+xml';
        if (cache) {
          res.statusCode = 304;
          cb(null, str(''), conentType, updatedDate);
        } else if (format === 'png' && data) {
          cb(null, fs.createReadStream(data), 'image/png', updatedDate);
        } else {
          let reader = str(data);
          cb(null, reader, conentType, updatedDate);
        }
      })
      .catch(cb);
  };
  Icon.remoteMethod('dropView', {
    isStatic: true,
    accepts: [
      { arg: 'name', type: 'string', default: '' },
      { arg: 'size', type: 'number', default: 36 },
      { arg: 'status', type: 'string' },
      { arg: 'color', type: 'string' },
      { arg: 'format', type: 'string', default: 'svg' },
      { arg: 'if-modified-since', type: 'string', http: { source: 'header' } }, // manual cache
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get', path: '/dropView/:name' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Last-Modified', type: 'date', http: { target: 'header' } },
    ],
  });
};
