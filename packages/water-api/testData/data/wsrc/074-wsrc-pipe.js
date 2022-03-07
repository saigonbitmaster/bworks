const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/11/2019, 4:38:30 PM*/
  {
    id: new ObjectId('5df0b916bba928111e313ef0'),
    name: 'test4',
    fromPosition: {
      lng: 105.91374518996281,
      lat: 20.660310622949286,
    },
    toPosition: {
      lng: 105.92973316734833,
      lat: 20.6618155018934,
    },
    polyline: [
      {
        lat: 20.660310622949286,
        lng: 105.91374518996281,
      },
      {
        lat: 20.660935540092744,
        lng: 105.91718143498701,
      },
      {
        lat: 20.66085522959976,
        lng: 105.92078632390303,
      },
      {
        lat: 20.662079960005396,
        lng: 105.9229964641313,
      },
      {
        lat: 20.661296936785877,
        lng: 105.9275884059648,
      },
      {
        lat: 20.6618155018934,
        lng: 105.92973316734833,
      },
    ],
    length: 1725,
    description: '',
  },

  /* 2 createdAt:12/11/2019, 4:30:24 PM*/
  {
    id: new ObjectId('5df0b730bba928111e313eef'),
    name: 'test3',
    fromPosition: {
      lng: 105.91374525512174,
      lat: 20.66031078495487,
    },
    toPosition: {
      lng: 105.9294341662021,
      lat: 20.664064327439874,
    },
    polyline: [
      {
        lat: 20.66031078495487,
        lng: 105.91374525512174,
      },
      {
        lat: 20.663665106116536,
        lng: 105.91245175270956,
      },
      {
        lat: 20.66633679902382,
        lng: 105.91446274603322,
      },
      {
        lat: 20.667842559370033,
        lng: 105.9165655979009,
      },
      {
        lat: 20.668364552805702,
        lng: 105.91952675665334,
      },
      {
        lat: 20.668525165809598,
        lng: 105.92197293127492,
      },
      {
        lat: 20.667912842009258,
        lng: 105.92452640260274,
      },
      {
        lat: 20.667581561979482,
        lng: 105.92695111120656,
      },
      {
        lat: 20.66645726040081,
        lng: 105.92849606359914,
      },
      {
        lat: 20.664064327439874,
        lng: 105.9294341662021,
      },
    ],
    length: 2617,
    description: '',
  },

  /* 3 createdAt:12/11/2019, 3:06:29 PM*/
  {
    id: new ObjectId('5df0a385bba928111e313eee'),
    name: 'test2',
    fromPosition: {
      lng: 105.93209597918053,
      lat: 20.658282287727822,
    },
    toPosition: {
      lng: 106.08933712991734,
      lat: 20.58751169798368,
    },
    polyline: [
      {
        lat: 20.658282287727822,
        lng: 105.93209597918053,
      },
      {
        lat: 20.632538584021887,
        lng: 105.94220019581576,
      },
      {
        lat: 20.614865954453652,
        lng: 105.94546176197787,
      },
      {
        lat: 20.60313662266856,
        lng: 105.94838000538607,
      },
      {
        lat: 20.587871071977588,
        lng: 105.97000933888216,
      },
      {
        lat: 20.58497847963779,
        lng: 105.98975039723177,
      },
      {
        lat: 20.583210757317996,
        lng: 106.01618624928255,
      },
      {
        lat: 20.57919313042155,
        lng: 106.03867388966341,
      },
      {
        lat: 20.579193130421565,
        lng: 106.05721331837435,
      },
      {
        lat: 20.578550300301544,
        lng: 106.07575274708529,
      },
      {
        lat: 20.581424073439642,
        lng: 106.08503381032722,
      },
      {
        lat: 20.58751169798368,
        lng: 106.08933712991734,
      },
    ],
    length: 22104,
    description: '',
  },

  /* 4 createdAt:12/5/2019, 5:07:18 PM*/
  {
    id: new ObjectId('5de8d6d628476c04e57aaef3'),
    name: 'test',
    fromPosition: {
      lng: 105.92291281391977,
      lat: 20.658204186376533,
    },
    toPosition: {
      lng: 105.91374569405912,
      lat: 20.660311104674452,
    },
    polyline: [
      {
        lat: 20.658204186376533,
        lng: 105.92291281391977,
      },
      {
        lat: 20.65537661595828,
        lng: 105.92388444413541,
      },
      {
        lat: 20.65373018214392,
        lng: 105.92242532243131,
      },
      {
        lat: 20.652886879868937,
        lng: 105.91607385148404,
      },
      {
        lat: 20.654292381061325,
        lng: 105.90916448106168,
      },
      {
        lat: 20.659392233386406,
        lng: 105.90590291489957,
      },
      {
        lat: 20.65943238902483,
        lng: 105.9085207508981,
      },
      {
        lat: 20.66248418649442,
        lng: 105.9096365498483,
      },
      {
        lat: 20.660311104674452,
        lng: 105.91374569405912,
      },
    ],
    length: 3751,
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Pipe;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc pipe error', err) : console.log('init wsrc pipe OK!')), // eslint-disable-line no-console
    );
  },
};
