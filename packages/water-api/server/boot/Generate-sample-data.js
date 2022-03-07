/*
const moment = require('moment');
const ObjectID = require('mongodb').ObjectID;

module.exports = function(app) {
    var test  = app.models.RawWaterSourceVolume;
    test.getDataSource().connector.connect(function (err, db) {
      //  db.createCollection("RawWaterSourceVolume");                   //Tạo một collection tên RawWaterSourceVolume
        var collection1 = db.collection("RawWaterSourceVolume")        //tạo object collection, khác với raw mongo ở syntax: db.test2.find() ...
        //tao va insert document vào collection, chay tung vong for, k dc chay dong thoi nhieu vong
       /!* for (let i = 1; i < 200000; i ++ ) {
            let obj = {};
            obj.volume =  i*600 + Math.floor(Math.random() * 150) - 150;
            obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
            obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
            obj.logTime  = moment("2018-01-01T10:00:00")
                .add(i*5, 'minutes')
                .toDate();
            obj.flowRate = 600 + Math.floor(Math.random() * 150) - 150;
            obj.waterSourceId = new ObjectID('5bea760ebac5750fb96bf558');
            obj.dataLoggerId =  new ObjectID('5be79e116c225b401e1f89e1');
            collection1.insert(obj);
        };*!/
        /!*  for (let i = 1; i < 200000; i ++ ) {
            let obj = {};
            obj.volume =  i*300 + Math.floor(Math.random() * 90) - 90;
            obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
            obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
            obj.logTime  = moment("2018-01-01T10:00:00")
                .add(i*5, 'minutes')
                .toDate();
            obj.flowRate = 300 + Math.floor(Math.random() * 90) - 90;
            obj.waterSourceId = new ObjectID('5bea401db994740ba99f6074');
            obj.dataLoggerId =  new ObjectID('5be79d976c225b401e1f89de');
            collection1.insert(obj);
        };*!/
    /!*    for (let i = 1; i < 200000; i ++ ) {
            let obj = {};
            obj.volume =  i*500 + Math.floor(Math.random() * 150) - 150;
            obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
            obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
            obj.logTime  = moment("2018-01-01T10:00:00")
                .add(i*5, 'minutes')
                .toDate();
            obj.flowRate = 500 + Math.floor(Math.random() * 150) - 150;
            obj.waterSourceId = new ObjectID('5bea760ebac5750fb96bf558');
            obj.dataLoggerId =  new ObjectID('5bea401db994740ba99f6074');
            collection1.insert(obj);
        };
*!/
       /!*  db.createCollection("RawWaterSourceQuality");                   //Tạo một collection tên RawWaterSourceQuality
         var collection1 = db.collection("RawWaterSourceQuality")        //tạo object collection, khác với raw mongo ở syntax: db.test2.find() ...
         //tao va insert document vào collection
         for (let i = 1; i < 100000; i ++ ) {
         let obj = {};
         obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
         obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
         obj.logTime  = moment("2018-01-01T10:00:00")
         .add(i*5, 'minutes')
         .toDate();
         obj.dataLoggerId =  new ObjectID('5be79e116c225b401e1f89e1');
         collection1.insert(obj);
         };*!/
      /!*  var collection1 = db.collection("RawWaterSourceQuality");
        for (let i = 1; i < 100000; i ++ ) {
            let obj = {};
            obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
            obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
            obj.logTime  = moment("2018-01-01T10:00:00")
                .add(i*5, 'minutes')
                .toDate();
            obj.dataLoggerId =  new ObjectID('5be79d976c225b401e1f89de');
            collection1.insert(obj);
        };*!/
       /!* var collection1 = db.collection("RawWaterSourceQuality");
        for (let i = 1; i < 100000; i ++ ) {
            let obj = {};
            obj.ntu =  4 + Math.floor(Math.random() * 2) - 2;
            obj.ph = 6 + Math.floor(Math.random() * 3) - 3;
            obj.logTime  = moment("2018-01-01T10:00:00")
                .add(i*5, 'minutes')
                .toDate();
            obj.dataLoggerId =  new ObjectID('5bea401db994740ba99f6074');
            collection1.insert(obj);
        };*!/
    });
};
*/
