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
    waterParameter: 'cod',
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
    waterParameter: 'ph',
  },

  /* 3 createdAt:11/22/2018, 4:02:34 PM*/
  {
    id: new ObjectId('5bf670aa6633fd4ae585792f'),
    name: 'Độ đục',
    alertType: '1',
    alertParam: '1',
    alertHigh: 3,
    alertCriticalHigh: 4,
    alertLow: 3,
    alertCriticalLow: 1,
    waterParameter: 'ntu',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.NmsAlertThreshold;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err ? console.error('init nms NmsAlertThreshold error', err) : console.log('init nms NmsAlertThreshold OK!'), // eslint-disable-line no-console
    );
  },
};
