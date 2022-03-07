const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:1/3/2020, 11:09:19 AM*/
  {
    id: new ObjectId('5e0ebe6f3265760c8e99627c'),
    fileNameReal: 'testPipe2.kml',
    fileNameS3: '20010304x+x8ut.kml',
    urlS3: 'https://hcm30.s3.ap-southeast-1.amazonaws.com/NmsFiles/20010304x%2Bx8ut.kml',
    active: true,
    description: '',
  },

  /* 2 createdAt:1/3/2020, 11:09:08 AM*/
  {
    id: new ObjectId('5e0ebe643265760c8e99627b'),
    fileNameReal: 'test-Filter.kml',
    fileNameS3: '20010304jkzdjh.kml',
    urlS3: 'https://hcm30.s3.ap-southeast-1.amazonaws.com/NmsFiles/20010304jkzdjh.kml',
    active: true,
    description: '',
  },

  /* 3 createdAt:1/3/2020, 11:08:49 AM*/
  {
    id: new ObjectId('5e0ebe513265760c8e99627a'),
    fileNameReal: 'test_PressureReducing.kml',
    fileNameS3: '20010304e1d0jr.kml',
    urlS3: 'https://hcm30.s3.amazonaws.com/NmsFiles/20010304e1d0jr.kml',
    active: true,
    description: '',
  },

  /* 4 createdAt:10/1/2019, 9:25:00 AM*/
  {
    id: new ObjectId('5d92b8fc1bba1f02c699e880'),
    fileNameReal: 'testFlowLogger.kml',
    fileNameS3: '19100102pojju2.kml',
    urlS3: 'https://hcm30.s3.amazonaws.com/NmsFiles/19100102pojju2.kml',
    active: true,
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Kml;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms Kml error', err) : console.log('init Kml OK!')), // eslint-disable-line no-console
    );
  },
};
