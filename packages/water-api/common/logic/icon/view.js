'use strict';
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const changeCase = require('change-case');
const moment = require('moment-timezone');
const str = require('string-to-stream');
const svg2png = require('svg2png');
const { get } = require('lodash');
const createError = require('http-errors');
const colorConfig = require('../../../server/color-config');
const iconMaps = require('./icon-maps');
const MATERIAL_ICON_LIB_URL = 'https://fonts.gstatic.com/s/i/materialicons/{icon}/v4/24px.svg';

module.exports = function(Icon) {
  Icon.getIcon = async (rawName, color = '#000', size = 24, modifiedSine, format = 'svg') => {
    if (typeof modifiedSine === 'string') {
      modifiedSine = new Date(modifiedSine);
    }
    let name = rawName.indexOf('Icon') === rawName.length - 4 ? rawName : rawName + 'Icon';
    format = format || 'svg';
    if (size < 8) {
      size = 8;
    } else if (size > 128) {
      size = 128;
    }
    if (size % 2 !== 0) {
      size = parseInt(size / 2) * 2;
    }
    let fixName = changeCase.snakeCase(name);
    let className = changeCase.camelCase(name);
    // check color
    if (color.indexOf('#') !== 0) {
      let fixColor =
        get(colorConfig, `theme.status.${color}`) ||
        get(colorConfig, `theme.${color}`) ||
        get(colorConfig, `theme.palette.${color}`);
      if (typeof fixColor === 'object') {
        fixColor = fixColor.main || '#000';
      }
      if (fixColor) {
        color = fixColor;
      }
    }
    let iconMap = iconMaps[name];
    let iconConent = '';
    if (iconMap) {
      if (typeof iconMap === 'string') {
        fixName = changeCase.snakeCase(iconMap);
      } else {
        iconConent = iconMap.data;
      }
    }
    let id = `Local-${fixName}-${size}-${color}-${format}`;
    // find current
    let current = await Icon.findById(id);
    if (current) {
      if (
        modifiedSine &&
        moment(modifiedSine).isValid() &&
        moment(current.updatedDate).diff(moment(modifiedSine)) >= 0
      ) {
        current.cache = true; //cache
        return current;
      }
      return current;
    } else {
      if (iconConent === '') {
        const downloadIconName = fixName.replace('_icon', '');
        const url = MATERIAL_ICON_LIB_URL.replace('{icon}', downloadIconName);
        // https://fonts.gstatic.com/s/i/materialicons/laptop_chromebook/v4/24px.svg?download=true
        // https://fonts.gstatic.com/s/i/materialicons/settings_remote/v4/24px.svg
        try {
          const fetchedIconResponse = await axios.get(url);
          if (fetchedIconResponse.data) {
            iconConent = fetchedIconResponse.data;
          }
          if (!fetchedIconResponse.data || fetchedIconResponse.status >= 400) {
            return Promise.reject({
              statusCode: fetchedIconResponse.status,
              message: fetchedIconResponse.statusText,
            });
          }
        } catch (error) {
          if (error.response) {
            return Promise.reject({ statusCode: error.response.status, message: error.response.statusText });
          } else {
            return Promise.reject({ statusCode: '500', message: 'error.NOT_FOUND' });
          }
        }
      }
      // update size
      if (size !== 24) {
        iconConent = iconConent.replace(/<svg(.*?)>/g, math => {
          let fix = math.replace(' width="24"', ` width="${size}"`);
          fix = fix.replace(' height="24"', ` height="${size}"`);
          return fix;
        });
      }
      // update color
      if (color !== 'none') {
        // add class
        iconConent = iconConent.replace(/<svg/g, math => {
          return math + ` class="${className}"`;
        });
        let style = `<style> svg.${className} {fill: ${color};} </style>`;
        iconConent = iconConent.replace(/<svg(.*?)>/g, math => {
          return math + style;
        });
      }

      if (format === 'png') {
        iconConent = await new Promise((resolve, reject) => {
          let buffer = Buffer.from(iconConent, 'utf8');
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
        format,
        name: fixName,
        color,
        size,
        data: iconConent,
        updatedDate: new Date(),
      });
    }
  };
  Icon.view = (name, color = '#000', size = 24, modifiedSine, format, res, cb) => {
    Icon.getIcon(name, color, size, modifiedSine, format)
      .then(record => {
        const { data, updatedDate, cache } = record;
        if (cache) {
          res.statusCode = 304;
          cb(null, str(''), 'image/svg+xml', updatedDate);
        } else if (format === 'png' && data) {
          cb(null, fs.createReadStream(data), 'image/png', updatedDate);
        } else {
          let reader = str(data);
          cb(null, reader, 'image/svg+xml', updatedDate);
        }
      })
      .catch(() => cb(createError(400, 'error.NOT_FOUND')));
  };
  Icon.remoteMethod('view', {
    isStatic: true,
    accepts: [
      { arg: 'name', type: 'string', default: '' },
      { arg: 'color', type: 'string', default: 'primary' },
      { arg: 'size', type: 'number', default: 24 },
      { arg: 'if-modified-since', type: 'string', http: { source: 'header' } }, // manual cache
      { arg: 'format', type: 'string', default: 'svg' },
      { arg: 'res', type: 'object', http: { source: 'res' } },
    ],
    http: { verb: 'get', path: '/view/:name' },
    returns: [
      { arg: 'body', type: 'file', root: true },
      { arg: 'Content-Type', type: 'string', http: { target: 'header' } },
      { arg: 'Last-Modified', type: 'date', http: { target: 'header' } },
    ],
  });
};
