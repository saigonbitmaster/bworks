'use strict';
const numeral = require('numeral');
const server = require('../../server');
const writtenNumber = require('./written-number');
const i18n = {
  vi: require('./vi'),
};
module.exports = (number, options = {}) => {
  console.log("aaaaaa", lang)
  let { upperFirst = true, prefix = '', postfix = '', lang, noAnd = true } = options;
  let app = server.getApp();
  let fixNum = null;
  if (!lang) {
    lang = app.get('locales') || 'vi';
    lang = i18n[lang] || lang;
  }
  if (!isNaN(number)) {
    fixNum = numeral(number);
  } else if (numeral.isNumeral(number)) {
    fixNum = number;
  }
  if (fixNum) {
    let text = writtenNumber(fixNum.value(), { lang, noAnd });
    text = upperFirst ? text.charAt(0).toUpperCase() + text.substr(1) : text;
    if (prefix) {
      text = `${prefix} ${text}`;
    }
    if (postfix) {
      text = `${text} ${postfix}`;
    }
    return text;
  }
  return '';
};
