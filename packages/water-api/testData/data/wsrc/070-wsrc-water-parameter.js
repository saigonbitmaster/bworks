const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5c07c820c3c3a6131dfa9c5e'),
    name: 'COD',
    symbol: 'COD',
    measureUnit: 'mg/l',
    normalMethod: 'Vật lý',
    waterStage: '1',
  },

  {
    id: new ObjectId('5bff848d24249576781f2f7b'),
    name: 'PH',
    symbol: 'PH',
    measureUnit: 'PH',
    normalMethod: 'Vật lý',
    waterStage: '5',
  },

  {
    id: new ObjectId('5bf38c31f48d06276f6dbb95'),
    name: 'Độ đục',
    symbol: 'NTU',
    measureUnit: 'NTU',
    normalMethod: 'Vật lý',
    waterStage: '5',
  },
];

module.exports = {
  init: async app => {
    let model = app.models.WaterParameter;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc parameter error', err) : console.log('init wsrc parameter OK!')), // eslint-disable-line no-console
    );
  },
};
