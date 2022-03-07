const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:3/22/2019, 12:39:50 PM*/
  {
    id: new ObjectId('5c9475266861c31652d447fa'),
    name: 'COD',
    alertType: '1',
    alertParam: '1',
    alertHigh: 75,
    alertCriticalHigh: 150,
    waterParameterId: new ObjectId('5c07c820c3c3a6131dfa9c5e'),
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
  },

  /* 2 createdAt:11/29/2018, 1:20:09 PM*/
  {
    id: new ObjectId('5bff851924249576781f2f7d'),
    name: 'PH',
    alertType: '3',
    alertParam: '1',
    alertHigh: 10,
    alertCriticalHigh: 15,
    alertLow: 5,
    alertCriticalLow: 2,
    waterParameterId: new ObjectId('5bff848d24249576781f2f7b'),
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
  },

  /* 3 createdAt:11/24/2018, 11:59:29 AM*/
  {
    id: new ObjectId('5bf8dab15bf6e003a6be5d08'),
    name: 'Sản lượng s-3.0',
    alertType: '3',
    alertParam: '3',
    alertHigh: 120,
    alertCriticalHigh: 150,
    alertLow: 80,
    alertCriticalLow: 50,
    waterSourceId: new ObjectId('5bea760ebac5750fb96bf558'),
  },

  /* 4 createdAt:11/24/2018, 11:58:55 AM*/
  {
    id: new ObjectId('5bf8da8f5bf6e003a6be5d07'),
    name: 'Sản lượng s-2.0',
    alertType: '3',
    alertParam: '3',
    alertHigh: 130,
    alertCriticalHigh: 150,
    alertLow: 70,
    alertCriticalLow: 50,
    waterSourceId: new ObjectId('5be7d5c96c225b401e1f8a15'),
  },

  /* 5 createdAt:11/24/2018, 10:39:08 AM*/
  {
    id: new ObjectId('5bf8c7dc8862875681303b61'),
    name: 'Sản lượng s-1.0',
    alertType: '3',
    alertParam: '3',
    alertHigh: 700,
    alertCriticalHigh: 800,
    alertLow: 70,
    alertCriticalLow: 50,
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
  },

  /* 6 createdAt:11/24/2018, 10:13:18 AM*/
  {
    id: new ObjectId('5bf8c1ce737d7556667b8c32'),
    name: 'Lưu lượng',
    alertType: '3',
    alertParam: '2',
    alertHigh: 700,
    alertCriticalHigh: 800,
    alertLow: 500,
    alertCriticalLow: 400,
    waterSourceId: new ObjectId('5bea760ebac5750fb96bf558'),
  },

  /* 7 createdAt:11/22/2018, 4:02:34 PM*/
  {
    id: new ObjectId('5bf670aa6633fd4ae585792f'),
    name: 'Độ đục',
    alertType: '1',
    alertParam: '1',
    alertHigh: 3,
    alertCriticalHigh: 4,
    alertLow: 3,
    alertCriticalLow: 1,
    waterParameterId: new ObjectId('5bf38c31f48d06276f6dbb95'),
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
  },
];
module.exports = {
  init: async app => {
    let model = app.models.AlertThreshold;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc AlertThreshold error', err) : console.log('init wsrc AlertThreshold OK!')), // eslint-disable-line no-console
    );
  },
};
