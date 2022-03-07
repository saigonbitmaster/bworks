const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/18/2019, 11:05:06 AM*/
  {
    id: ObjectId('5df9a5729f15ba26024895c9'),
    name: 'Tram Bom 01',
    position: {
      lng: 105.93359936523439,
      lat: 20.71535268651591,
    },
    designCapacity: 500000,
    designElectricRate: 0.5,
    description: '',
    factoryId: ObjectId('5d95608b2616f91c3fd7d383'),
  },

  /* 2 createdAt:12/18/2019, 10:51:10 AM*/
  {
    id: ObjectId('5df9a22e464ccc238313d007'),
    name: 'Tram bom 02',
    position: {
      lng: 106.01765350341793,
      lat: 20.622415261332552,
    },
    designCapacity: 160000,
    designElectricRate: 0.4,
    description: '',
    factoryId: ObjectId('5d9560302616f91c3fd7d382'),
  },

  /* 3 createdAt:12/18/2019, 10:34:07 AM*/
  {
    id: ObjectId('5df99e2f891a6406abafaf10'),
    name: 'Tram bom 03',
    position: {
      lng: 106.03462615966794,
      lat: 20.755058394114506,
    },
    designCapacity: 180000,
    designElectricRate: 0.3,
    description: '<p>122222</p>',
    factoryId: ObjectId('5d955f5c2616f91c3fd7d378'),
  },
];
module.exports = {
  init: async app => {
    let model = app.models.PumpStation;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms PumpStation error', err) : console.log('init PumpStation OK!')), // eslint-disable-line no-console
    );
  },
};
