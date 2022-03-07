'use strict';

const getConnectorFromModel = (baseModel, model) => {
  if (!baseModel.getConnector().db) {
    throw new Error(`Invoke this in ${baseModel.definition.name} remote method`);
  }
  if (!model) {
    return baseModel.getDataSource().connector.collection(baseModel.definition.name);
  } else {
    if (!baseModel.app.models[model]) {
      throw new Error('INVALID_MODEL');
    }
    return baseModel.app.models[model].getDataSource().connector.collection(model);
  }
};

module.exports = {
  getConnectorFromModel,
};
