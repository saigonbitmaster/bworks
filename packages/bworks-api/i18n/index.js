const en = require('./en');
const messages = {
 en
};

module.exports = locale => {
  let result = messages[locale];
  return result;
};
