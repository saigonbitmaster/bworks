'use strict';
// const util = require('util');

const getDb = Model => {
  return new Promise((resolve, reject) => {
    Model.getDataSource().connector.connect(function(err, db) {
      if (err) return reject(err);
      resolve(db);
    });
  });
};

const updateMany = async (Model, filter, update, options) => {
  let modelName = Model.definition.name;
  return new Promise((resolve, reject) => {
    Model.getDataSource().connector.connect(function(err, db) {
      if (err) return reject(err);
      var collection = db.collection(modelName);

      collection.updateMany(filter, update, options || {}, function(err, result) {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });
};

const createView = async (Model, pipeline, postFix = '_View') => {
  let modelName = Model.definition.name;
  let modelViewName = modelName + postFix;
  const db = await getDb(Model);
  await db.dropCollection(modelViewName).finally(() => {
    return db.createCollection(modelName + postFix, {
      pipeline,
      viewOn: modelName,
    });
  });
};

const rawExecute = async (dataSource, modelName, execFunc) => {
  return new Promise((resolve, reject) => {
    dataSource.connector.connect(function(err, db) {
      if (err) return reject(err);
      var collection = db.collection(modelName);
      execFunc(collection)
        .then(resolve)
        .catch(reject);
    });
  });
};

module.exports = { updateMany, createView, rawExecute };
