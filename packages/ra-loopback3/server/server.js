'use strict';
const _ = require('lodash');
const moment = require('moment-timezone');
const numeral = require('numeral');
require('numeral/locales/vi');
const momentVi = require('moment/locale/vi');
const defaultDataConfig = require('./data-config');

let server = {};
let globalApp = null;

server.commonConfig = app => {
  app.dataConfig = _.merge(defaultDataConfig, app.dataConfig || {});
  globalApp = app;
  moment.updateLocale('vi', momentVi);
  let locales = app.get('locales') || 'vi';
  let timeZone = app.get('timezone') || 'Asia/Ho_Chi_Minh';
  moment.tz.setDefault(timeZone);
  moment.locale(locales);
  // numeral.register('locale', 'vi', numVi);
  numeral.locale(locales);
};

server.getApp = () => {
  return globalApp;
};

module.exports = server;
