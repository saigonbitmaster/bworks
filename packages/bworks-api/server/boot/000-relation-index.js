'use strict';
module.exports = app => {

  // add index for relation keys for all models
  Object.keys(app.models).map(modelKey => {
    let currentModel = app.models[modelKey];
    let definition = currentModel.definition;
    if (!definition.settings.indexes) {
      definition.settings.indexes = {};
    }
    let relations = definition.settings.relations;
    if (relations) {
      let indexes = definition.settings.indexes;
      Object.keys(relations).map(key => {
        let relation = relations[key];
        let relationKey = `relation_${key}`;
        let relationFieldKey = relation.foreignKey ? relation.foreignKey : key + 'Id';
        // check properties define
        if (definition.properties[relationFieldKey] && definition.properties[relationFieldKey].index) {
          // eslint-disable-next-line no-console
          console.error('Model', modelKey, 'property:', relationFieldKey, 'Already define index');
        } else if (indexes[relationKey]) {
          // eslint-disable-next-line no-console
          console.error('Model', modelKey, 'indexes:', relationKey, 'Already define index');
        }
        indexes[relationKey] = {};
        indexes[relationKey][relationFieldKey] = 1;
        // console.log('Add index', modelKey, relationKey, relationFieldKey);
      });
    }
  });
};
