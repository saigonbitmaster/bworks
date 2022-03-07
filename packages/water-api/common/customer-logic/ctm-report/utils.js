const path = require('path');
const fs = require('fs');
const numeral = require('numeral');
const has = require('lodash/has');
const get = require('lodash/get');
const isEmpty = require('lodash/isEmpty');
const dictionary = require('../../../i18n/vi/generic');

const getTime = date => {
  const parsedDate = new Date(date);
  return { date: { month: parsedDate.getMonth() + 1, year: parsedDate.getFullYear() } };
};

const getGeo = async (model, filterWhere) => {
  const geo = { province: '', district: '', ward: '' };
  if (has(filterWhere, 'provinceId') && !isEmpty(filterWhere.provinceId)) {
    geo.province = await model.app.models.GeoProvince.findById(filterWhere.provinceId).then(({ fullName }) => fullName);
  }
  if (has(filterWhere, 'districtId') && !isEmpty(filterWhere.districtId)) {
    geo.district = await model.app.models.GeoDistrict.findById(filterWhere.districtId).then(({ fullName }) => fullName);
  }
  if (has(filterWhere, 'wardId') && !isEmpty(filterWhere.wardId)) {
    geo.ward = await model.app.models.GeoWard.findById(filterWhere.wardId).then(({ fullName }) => fullName);
  }
  return geo;
};

const getCompanyLogoImage = () => {
  // Get the logo's path
  const logoPath = path.resolve(__dirname, '../../common-logic/engine/report/logo.png');
  // Read the image's data with the Base64 encoding
  const logo = fs.readFileSync(logoPath, { encoding: 'base64' });
  // Return
  return `data:image/png;base64,${logo}`;
};

const getFormattedNumber = number => numeral(number).format('0,0.[000]');

const getTranslatedTerm = path => get(dictionary, path);

module.exports = {
  getTime,
  getGeo,
  getCompanyLogoImage,
  getFormattedNumber,
  getTranslatedTerm,
};
