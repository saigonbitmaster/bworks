'use strict';
const numeral = require('numeral');

const minPositive = (a, b) => {
  a = numeral(a).value() || 0;
  b = numeral(b).value() || 0;
  return a > 0 && b > 0 ? Math.min(a, b) : Math.max(0, a, b);
};

const maxPositive = (a, b) => {
  a = numeral(a).value() || 0;
  b = numeral(b).value() || 0;
  return a > 0 && b > 0 ? Math.max(a, b) : Math.max(0, a, b);
};

const parseFloatPositive = data => {
  return numeral(data).value() || 0;
};

const sumPositive = (a, b) => {
  a = numeral(a).value() || 0;
  b = numeral(b).value() || 0;
  return (a > 0 ? a : 0) + (b > 0 ? b : 0);
};

module.exports = { minPositive, maxPositive, parseFloatPositive, sumPositive };
