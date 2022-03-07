const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5c08ca65b7387226c4df6eb3'),
    name: 'TCVN 01',
    applyFor: '1',
    issuedDate: new Date('2018-12-06T14:05:54'),
    issuedOrg: 'VN',
    isInValid: true,
    paramItemList: [
      {
        value: '11',
        id: null,
        waterParameterId: ObjectId('5c07c820c3c3a6131dfa9c5e'),
      },
    ],
  },
];
module.exports = {
  init: async app => {
    let model = app.models.WaterStandard;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc WaterStandard error', err) : console.log('init wsrc WaterStandard OK!')), // eslint-disable-line no-console
    );
  },
};
