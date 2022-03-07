'use strict';

module.exports = async (Model, datas) => {
  if (!datas || datas.length == 0) return 0;
  let modelName = Model.definition.name;
  return new Promise((resolve, reject) => {
    Model.getDataSource().connector.connect(function(err, db) {
      if (err) return reject(err);
      var collection = db.collection(modelName);
      let fixData = [];
      datas.map(item => {
        const { _id, id, ...rest } = item.__data || item;
        fixData.push(new Model({ _id: _id || id, ...rest }).__data);
      });
      collection.insertMany(fixData, function(err, result) {
        // Finish up test
        // db.close();
        if (err) return reject(err);
        resolve(result.insertedCount);
      });
    });
  });
};
