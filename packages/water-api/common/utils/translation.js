'use strict';
const get = require('lodash/get');
const { isEqualGi } = require('./str');

// The language for value to be translated is stored in config. Retrieve it
const configuredLang = require('../../server/config.json').locales;

const translate = (value, { type, model }) => {
  // Locating the object within the centralized one by the model
  const translationRepository = require(`../../i18n/${configuredLang}/resources`);
  if (!translationRepository) {
    throw new Error('Requested repo does not exist');
  }
  let exactTypeInRepo = 'fields';
  if (type === 'header') {
    exactTypeInRepo = 'fields';
  } else if (type === 'value') {
    exactTypeInRepo = 'values';
  }
  const translatedValue = get(translationRepository, [model, exactTypeInRepo, value], value);
  //   Return the value if existed, else return the original value
  return translatedValue;
};

const reverseTranslate = (value, { type, model, lang, key }) => {
  try{
    const translationRepository = require(`../../i18n/${lang}/resources`);
    let exactTypeInRepo = 'fields';
    let pathMap;
    if (type === 'header') {
      exactTypeInRepo = 'fields';
      pathMap = [model, exactTypeInRepo]
    } else if (type === 'value') {
      exactTypeInRepo = 'values';
      pathMap = [model, exactTypeInRepo, key]
    }
    const destinationObject = get(translationRepository, pathMap);
    if (type === 'header' && !destinationObject) {
      throw new Error(`Header: ${type}, value: ${value}Request repo does not exist`);
    }
    const destinationObjectItems = Object.entries(destinationObject || {});
    for (let [k, v] of destinationObjectItems) {
      if (isEqualGi(v, value)) {
        return k;
      }
    }
    return value;
  } catch(e){
    throw e;
  }
};

module.exports = {
  translate,
  reverseTranslate,
};
