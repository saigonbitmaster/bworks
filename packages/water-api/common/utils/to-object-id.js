const validator = require('validator');
const ObjectID = require('mongodb').ObjectID;

module.exports = input => {
  if (input === undefined || input === null) {
    return input;
  }
  if (typeof input === 'string') {
    if (validator.isMongoId(input)) {
      return ObjectID(input);
    } else {
      return input;
    }
  } else if (typeof input === 'object') {
    return input;
  } else if (input.toString) {
    return input.toString();
  } else {
    return JSON.stringify(input);
  }
};
