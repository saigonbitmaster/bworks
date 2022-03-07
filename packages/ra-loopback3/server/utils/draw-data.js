'use strict';
const _ = require('lodash');

let rawData = {};
rawData.create = async (dataSource, collectionName, rawData) => {
  let data = _.clone(rawData);
  if (data.id) {
    data._id = data.id;
    delete data.id;
  }
  if (data._id) {
    data._id = dataSource.ObjectID(data._id);
  }

  return new Promise((resolve, reject) => {
    dataSource.connector.connect((err, db) => {
      let collection = db.collection(collectionName);
      collection
        .insertOne(data)
        .then(res => {
          if (res && res._id) {
            res.id = res._id;
            delete res._id;
          }
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  });
};

module.exports = rawData;
