const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5be79dbd6c225b401e1f89df'),
    name: 'Pum 01',
    typeOfPump: '1',
    powerCapacity: 11,
    maxHead: 11,
    maxDepth: 11,
    maxFlowRate: 11,
    rotationRate: 11,
    inputDiameter: 11,
    outputDiameter: 11,
    powerSource: 111,
    weight: 111,
    dimensions: '11',
    setupDate: new Date('2018-11-11T10:10:20'),
    position: {
      lng: 105.93509991540532,
      lat: 20.65699556447286,
    },
    waterSourceId: ObjectId('5be7d5c96c225b401e1f8a15'),
    materialStatus: '2',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Pump;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc pump error', err) : console.log('init wsrc pump OK!')), // eslint-disable-line no-console
    );
  },
};
