const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:10/3/2019, 9:44:27 AM*/
  {
    id: new ObjectId('5d95608b2616f91c3fd7d383'),
    name: 'NM033',
    acreage: 1100,
    position: {
      lng: 106.7731700063016,
      lat: 20.98740145257472,
    },
    useStartDate: new Date('2019-08-01T00:00:00'),
    designCapacityDay: 70000,
    currentCapacityDay: 60000,
    avgPH: 7.4,
    avgTurbidity: 0.15,
    currentLossRate: 8,
    powerConsumption: 7000,
    boundary: [
      {
        lat: 20.640861116512045,
        lng: 105.94316848385722,
      },
      {
        lat: 20.619815538880015,
        lng: 105.94917663205058,
      },
      {
        lat: 20.64078079541349,
        lng: 105.97423919308574,
      },
      {
        lat: 20.64487711735861,
        lng: 105.95321067440898,
      },
    ],
    nodeId: new ObjectId('5da3e1851bf6f21b823df57b'),
    description: '',
  },

  /* 2 createdAt:10/3/2019, 9:42:56 AM*/
  {
    id: new ObjectId('5d9560302616f91c3fd7d382'),
    name: 'KCN DV2',
    acreage: 1000,
    position: {
      lng: 106.0893376625977,
      lat: 20.58750934162987,
    },
    useStartDate: new Date('2019-10-03T09:40:34'),
    designCapacityDay: 90000,
    currentCapacityDay: 80000,
    avgPH: 7.6,
    avgTurbidity: 0.2,
    currentLossRate: 2,
    powerConsumption: 8000,
    boundary: [
      {
        lat: 20.64075968599627,
        lng: 105.91828534488218,
      },
      {
        lat: 20.641562895184755,
        lng: 105.91210553531187,
      },
      {
        lat: 20.64043840113325,
        lng: 105.90094754580991,
      },
      {
        lat: 20.636248165420547,
        lng: 105.89758628991467,
      },
      {
        lat: 20.62885822276931,
        lng: 105.89655632165295,
      },
      {
        lat: 20.619379292807555,
        lng: 105.89964622643811,
      },
      {
        lat: 20.615844625500678,
        lng: 105.90531105187756,
      },
      {
        lat: 20.616647966183308,
        lng: 105.91217750695569,
      },
      {
        lat: 20.609417747508807,
        lng: 105.91732734826428,
      },
      {
        lat: 20.610703144798745,
        lng: 105.92488044885022,
      },
      {
        lat: 20.622431894001387,
        lng: 105.92247718957287,
      },
    ],
    nodeId: new ObjectId('5d95b2a5782d7e67841ede72'),
    description: '',
  },

  /* 3 createdAt:10/3/2019, 9:39:24 AM*/
  {
    id: new ObjectId('5d955f5c2616f91c3fd7d378'),
    name: 'KCN DV 1',
    acreage: 1200,
    position: {
      lng: 105.91374560853956,
      lat: 20.660308688342628,
    },
    useStartDate: new Date('2019-02-01T00:00:00'),
    designCapacityDay: 150000,
    currentCapacityDay: 120000,
    avgPH: 7.5,
    avgTurbidity: 0.1,
    currentLossRate: 5,
    powerConsumption: 10000,
    boundary: [
      {
        lat: 20.670952556829807,
        lng: 105.91470525621355,
      },
      {
        lat: 20.660833767612928,
        lng: 105.91865346788347,
      },
      {
        lat: 20.642361224241636,
        lng: 105.91865346788347,
      },
      {
        lat: 20.64701972943112,
        lng: 105.93805120347918,
      },
      {
        lat: 20.661476250459,
        lng: 105.93667791246355,
      },
      {
        lat: 20.672237434209187,
        lng: 105.9368495738405,
      },
      {
        lat: 20.67898286207276,
        lng: 105.93444631456316,
      },
      {
        lat: 20.679785869235673,
        lng: 105.93307302354754,
      },
      {
        lat: 20.6752889744121,
        lng: 105.92054174302996,
      },
    ],
    nodeId: new ObjectId('5b4ef6806339ec2a4228adec'),
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Factory;
    // mapSeries(
    //   data,
    //   async item => {
    //     let record = dataUtil.defaultOperationData({ data: item, app });
    //     await model.replaceOrCreate(record);
    //     return true;
    //   },
    //   err => (err ? console.error('init wsrc factory error', err) : console.log('init wsrc factory OK!')), // eslint-disable-line no-console
    // );
  },
};
