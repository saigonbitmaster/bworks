const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:10/9/2019, 3:12:02 PM*/
  {
    id: new ObjectId('5d9d9652d084971b88fb5c08'),
    name: 'nhom nguon 1',
    type: 'ACTIVE',
    estimatedReserves: 10000,
    boundary: [
      {
        lat: 20.69900916959182,
        lng: 105.96582591674428,
      },
      {
        lat: 20.68905154383188,
        lng: 105.94144682888304,
      },
      {
        lat: 20.675318589767528,
        lng: 105.95355053222613,
      },
      {
        lat: 20.680619175228955,
        lng: 105.98582706881393,
      },
      {
        lat: 20.696519823635544,
        lng: 105.98685717326407,
      },
    ],
    provinceId: new ObjectId('5d64e1df4e18e133e43424b1'),
    districtId: new ObjectId('5d64e25b4e18e133e43424b2'),
    wardId: new ObjectId('5d64e2ba4e18e133e43424b3'),
    quarterId: new ObjectId('5d64e3234e18e133e43424b4'),
    description: '',
  },

  /* 2 createdAt:11/11/2018, 2:09:32 PM*/
  {
    id: new ObjectId('5be7d5ac6c225b401e1f8a14'),
    name: 'Group 2 ',
    estimatedReserves: 111,
    boundary: [
      {
        lat: 10.770903121854314,
        lng: 106.63367808435055,
      },
      {
        lat: 10.771661987827622,
        lng: 106.64938510034176,
      },
      {
        lat: 10.76213386526787,
        lng: 106.64921343896481,
      },
      {
        lat: 10.762218186257794,
        lng: 106.6360813436279,
      },
    ],
    provinceId: new ObjectId('5b8f90007ff7ca030a652d82'),
    districtId: new ObjectId('5b9b9f4a02906208429812e1'),
    wardId: new ObjectId('5b9ba12702906208429812e8'),
    quarterId: new ObjectId('5c36fa68c3e2633270f27c18'),
    description: '',
  },

  /* 3 createdAt:11/11/2018, 10:09:18 AM*/
  {
    id: new ObjectId('5be79d5e6c225b401e1f89dd'),
    name: 'Group 1',
    estimatedReserves: 1,
    boundary: [
      {
        lat: 10.76306139485969,
        lng: 106.66869700524899,
      },
      {
        lat: 10.773011078169805,
        lng: 106.66886866662594,
      },
      {
        lat: 10.774022891960028,
        lng: 106.67813838098141,
      },
      {
        lat: 10.766012606388816,
        lng: 106.68448985192867,
      },
      {
        lat: 10.761712259964463,
        lng: 106.67702258203121,
      },
    ],
    provinceId: new ObjectId('5c36d0cd4ddf9f0f33e62267'),
    districtId: new ObjectId('5c36d0de4ddf9f0f33e62354'),
    wardId: new ObjectId('5c36d1934ddf9f0f33e63114'),
    quarterId: new ObjectId('5c36d4d3cf582112ecfc5403'),
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.WaterSourceGroup;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err ? console.error('init wsrc WaterSourceGroup error', err) : console.log('init wsrc WaterSourceGroup OK!'), // eslint-disable-line no-console
    );
  },
};
