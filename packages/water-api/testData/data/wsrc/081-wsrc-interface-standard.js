const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/31/2019, 9:49:36 AM*/
  {
    id: new ObjectId('5e0ab740eb66630a6d5479fb'),
    name: 'giao tiep du lieu 2',
    interfaceStandardType: 'DM',
    dataRate: '200',
    frequency: '20',
    range: '200',
  },

  /* 2 createdAt:12/31/2019, 9:49:12 AM*/
  {
    id: new ObjectId('5e0ab728eb66630a6d5479fa'),
    name: 'giao tiep du lieu 1',
    interfaceStandardType: 'MM',
    dataRate: '100',
    frequency: '10',
    range: '100',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.InterfaceStandard;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err ? console.error('init wsrc InterfaceStandard error', err) : console.log('init wsrc InterfaceStandard OK!'), // eslint-disable-line no-console
    );
  },
};
