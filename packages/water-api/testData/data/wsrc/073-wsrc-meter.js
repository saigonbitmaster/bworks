const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5be79e626c225b401e1f89e2'),
    name: 'Meter 01 ',
    size: 'DN 50',
    setupDate: new Date('2018-11-11T10:13:07'),
    environmentalRating: 'IP68',
    materialStatus: '1',
    position: {
      lng: 105.94145138635258,
      lat: 20.661252070225835,
    },
    dataLoggerId: ObjectId('5be79e116c225b401e1f89e1'),
    waterSourceId: ObjectId('5be79d976c225b401e1f89de'),
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Meter;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc meter error', err) : console.log('init wsrc meter OK!')), // eslint-disable-line no-console
    );
  },
};
