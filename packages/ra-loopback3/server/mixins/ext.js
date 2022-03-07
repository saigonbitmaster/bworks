'use strict';

// eslint-disable-next-line no-unused-vars
module.exports = function(Model, options) {
  Model.defineProperty('description', {
    type: 'string',
    default: '',
    length: 2048,
    require: false,
  });
  Model.defineProperty('tags', {
    type: ['string'],
    length: 128,
    index: true,
    require: false,
  });
};
