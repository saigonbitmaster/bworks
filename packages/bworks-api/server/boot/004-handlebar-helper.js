'use strict';
const handlebars = require('handlebars');
const moment = require('moment-timezone');
const format = require('../../common/utils/format');
const VNnum2words = require('vn-num2words');

module.exports = async app => {
  handlebars.registerHelper('formatDate', value => {
    const m = moment(value);
    if (m.isValid()) {
      return m.format('L');
    }
    return '';
  });

  handlebars.registerHelper('formatMonth', value => {
    const m = moment(value);
    if (m.isValid()) {
      return m.format('MM/YYYY');
    }
    return '';
  });

  handlebars.registerHelper('formatNumber', value => {
    if (isNaN(value)) {
      return value;
    }
    return format.number(value);
  });
  handlebars.registerHelper('qr', (text, options = {}) => {
    if (text) {
      const { width = 100 } = options.hash;
      const qrUrl = `http://localhost:${app.get('port') || 4001}/api/icons/qr?text=${text}&width=${width}`;
      return qrUrl;
    }
    return '';
  });

  handlebars.registerHelper('Plus', value => {
    return format.number(++value);
  });
  handlebars.registerHelper('toWords', value => {
    if (typeof value === 'number') {
      let wordNumber = VNnum2words(Number(value));

      return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1) + ' đồng';
    }

    return value;
    //return wordNumber.charAt(0).toUpperCase() + wordNumber.slice(1);
  });
  handlebars.registerHelper('getFirstItem', (value, key) => {
    if (Array.isArray(value)) {
      let firstItem = value[0];
      if (isNaN(firstItem[key])) {
        return firstItem[key];
      }
      return format.number(firstItem[key]);
    }

    return '';
  });
  handlebars.registerHelper('fixNumberLength', (value, size) => {
    if (isNaN(value)) {
      return value;
    }
    var s = value + '';
    while (s.length < size) s = '0' + s;
    return s;
  });
};
