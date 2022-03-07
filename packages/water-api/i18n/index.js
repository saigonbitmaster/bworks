const vi = require('./vi');
const messages = {
  vi,
};

module.exports = locale => {
  let result = messages[locale];
  return result;
};
