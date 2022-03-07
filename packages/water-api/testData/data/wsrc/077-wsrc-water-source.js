const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:10/9/2019, 3:14:52 PM*/
  {
    id: new ObjectId('5d9d96fcd084971b88fb5c1e'),
    name: 'nguon 1',
    sourceStatus: '1',
    volumeCapacity: 1000,
    dailyCapacity: 2222,
    monthlyCapacity: 3333,
    yearCapacity: 55555,
    setupDate: new Date('2019-10-09T00:00:00'),
    position: {
      lng: 105.929735,
      lat: 20.661814,
    },
    waterSourceGroupId: new ObjectId('5d9d9652d084971b88fb5c08'),
    typeOfWaterSource: '1',
  },

  /* 2 createdAt:10/8/2019, 10:44:16 AM*/
  {
    id: new ObjectId('5d9c0610f868f51bc302efbf'),
    name: 'Ho Cao Van',
    sourceStatus: '1',
    volumeCapacity: 20000000,
    dailyCapacity: 100000,
    yearCapacity: null,
    setupDate: new Date('2019-07-04T00:00:00'),
    position: {
      lng: 107.208496,
      lat: 21.065834,
    },
    waterSourceGroupId: new ObjectId('5d9d9652d084971b88fb5c08'),
    typeOfWaterSource: '1',
  },

  /* 3 createdAt:11/13/2018, 1:58:22 PM*/
  {
    id: new ObjectId('5bea760ebac5750fb96bf558'),
    name: 'Source 3.0',
    sourceStatus: '1',
    volumeCapacity: 1,
    dailyCapacity: 10000,
    monthlyCapacity: 300000,
    yearCapacity: 1200000,
    setupDate: new Date('2018-11-13T13:58:09'),
    isBackupSource: true,
    position: {
      lng: 105.929435,
      lat: 20.664063,
    },
    waterSourceGroupId: new ObjectId('5d9d9652d084971b88fb5c08'),
    typeOfWaterSource: '2',
  },

  /* 4 createdAt:11/11/2018, 2:10:01 PM*/
  {
    id: new ObjectId('5be7d5c96c225b401e1f8a15'),
    name: 'Source 2.0',
    sourceStatus: '2',
    volumeCapacity: 1,
    dailyCapacity: 5000,
    monthlyCapacity: 150000,
    yearCapacity: 1350000,
    setupDate: new Date('2018-11-11T14:09:42'),
    lastMaintainedDate: new Date('2018-11-11T14:09:42'),
    position: {
      lng: 105.922912,
      lat: 20.6582,
    },
    waterSourceGroupId: new ObjectId('5be7d5ac6c225b401e1f8a14'),
    typeOfWaterSource: '1',
  },

  /* 5 createdAt:11/11/2018, 10:10:15 AM*/
  {
    id: new ObjectId('5be79d976c225b401e1f89de'),
    name: 'Source 1.0',
    sourceStatus: '3',
    volumeCapacity: 1000,
    dailyCapacity: 4000,
    monthlyCapacity: 120000,
    yearCapacity: 1440000,
    dimensions: '3x3x3',
    setupDate: new Date('2018-11-11T10:09:24'),
    lastMaintainedDate: new Date('2018-11-11T10:09:24'),
    position: {
      lng: 105.932096,
      lat: 20.658281,
    },
    waterSourceGroupId: new ObjectId('5be79d5e6c225b401e1f89dd'),
    position: {
      lng: 105.92986424340825,
      lat: 20.663420432972877,
    },
    typeOfWaterSource: '1',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.WaterSource;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc WaterSource error', err) : console.log('init wsrc WaterSource OK!')), // eslint-disable-line no-console
    );
  },
};
