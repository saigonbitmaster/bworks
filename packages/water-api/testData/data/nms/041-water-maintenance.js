const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:10/21/2019, 10:57:34 AM*/
  {
    id: new ObjectId('5dad2cae49c15c082bbfbe50'),
    date: new Date('2019-10-01T00:00:00'),
    value: 111,
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    description: '',
  },

  /* 2 createdAt:10/21/2019, 10:36:35 AM*/
  {
    id: new ObjectId('5dad27c349c15c082bbfbe4f'),
    date: new Date('2019-09-27T00:00:00'),
    value: 300,
    dmaId: new ObjectId('5b447dee21c0782a6f4a7550'),
    description: '',
  },

  /* 3 createdAt:10/21/2019, 10:25:22 AM*/
  {
    id: new ObjectId('5dad25224f44d502fb136da6'),
    date: new Date('2019-05-24T00:00:00'),
    value: 111,
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    description: '',
  },

  /* 4 createdAt:10/21/2019, 10:13:31 AM*/
  {
    id: new ObjectId('5dad225b4f44d502fb136da5'),
    date: new Date('2019-09-12T00:00:00'),
    value: 222,
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    description: '',
  },

  /* 5 createdAt:10/21/2019, 10:13:04 AM*/
  {
    id: new ObjectId('5dad22404f44d502fb136da4'),
    date: new Date('2019-09-02T00:00:00'),
    value: 100,
    dmaId: new ObjectId('5b448d3a21c0782a6f4a7554'),
    description: '',
  },

  /* 6 createdAt:10/2/2019, 11:01:13 AM*/
  {
    id: new ObjectId('5d9421096c656d1b83b39c5a'),
    date: new Date('2019-08-07T00:00:00'),
    value: 3000,
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    description: '',
  },

  /* 7 createdAt:9/27/2019, 11:06:55 AM*/
  {
    id: new ObjectId('5d8d8adf3806541b83d63675'),
    date: new Date('2019-05-14T00:00:00'),
    value: 100,
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    description: '',
  },

  /* 8 createdAt:9/26/2019, 5:36:06 PM*/
  {
    id: new ObjectId('5d8c9496d426fc7ad0c311a0'),
    date: new Date('2019-03-26T00:00:00'),
    value: 3000,
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    description: '',
  },

  /* 9 createdAt:9/26/2019, 5:34:06 PM*/
  {
    id: new ObjectId('5d8c941ed426fc7ad0c3119f'),
    date: new Date('2019-04-23T00:00:00'),
    value: 500,
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    description: '',
  },

  /* 10 createdAt:9/26/2019, 5:28:37 PM*/
  {
    id: new ObjectId('5d8c92d5d426fc7ad0c3119e'),
    date: new Date('2019-05-29T00:00:00'),
    value: 500,
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    description: '',
  },

  /* 11 createdAt:9/26/2019, 11:28:53 AM*/
  {
    id: new ObjectId('5d8c3e85d426fc7ad0c31191'),
    date: new Date('2018-03-08T00:00:00'),
    value: 5000,
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    description: '',
  },

  /* 12 createdAt:9/24/2019, 3:02:22 PM*/
  {
    id: new ObjectId('5d89cd8e0619561b44d4a879'),
    date: new Date('2018-08-08T00:00:00'),
    value: 500,
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.WaterMaintenance;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err ? console.error('init nms WaterMaintenance error', err) : console.log('init nms WaterMaintenance OK!'), // eslint-disable-line no-console
    );
  },
};
