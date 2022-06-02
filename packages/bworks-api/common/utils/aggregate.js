'use strict';

module.exports = async (Model, query, session = false) => {
  let modelName = Model.definition.name;
  return new Promise((resolve, reject) => {
    // apply log operation for aggreate here // todo
    Model.getDataSource().connector.connect(function(err, db) {
      if (err) return reject(err);
      var collection = db.collection(modelName);
      var cursor = session
        ? collection.aggregate(query, { session, allowDiskUse: true })
        : collection.aggregate(query, { allowDiskUse: true });
      cursor.get(function(err, data) {
        // db.close();
        if (err) return reject(err);
        return resolve(data);
      });
    });
  });
};
