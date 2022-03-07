'use strict';
const toObjectId = require('./to-object-id');

module.exports = async (Model, datas, session) => {
  if (!datas || datas.length == 0) return 0;
  let modelName = Model.definition.name;
  return new Promise((resolve, reject) => {
    Model.getDataSource().connector.connect(function(err, db) {
      if (err) return reject(err);
      var collection = db.collection(modelName);
      const updateQueries = [];
      for (const item of datas) {
        const { id, $condition, ...rest } = item;
        let condition = $condition ? $condition : { _id: toObjectId(id) };
        updateQueries.push({ updateOne: { filter: condition, update: { $set: rest } } });
      }
      collection.bulkWrite(updateQueries, session ? { session } : {}, (error, result) => {
        if (error) return reject(error);
        resolve(result.modifiedCount);
      });
    });
  });
};
