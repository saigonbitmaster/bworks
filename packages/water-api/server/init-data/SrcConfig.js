'use strict';

module.exports = [
  {
    id: 'StatisticMatLifeSpan',
    side: 'all',
    value: {
      existTime: {
        condition: '>',
        value: 24,
      },
      lessTime: {
        condition: '>',
        value: 12,
      },
    },
  },
  {
    id: 'Sms',
    side: 'all',
    value: {
      phoneList: ['0909618609', '0982077215'],
      isNotifySms: true,
    },
  },
  {
    id: 'MapDefaultZoom',
    side: 'all',
    value: 14,
  },

  {
    id: 'MapDefaultCenter',
    side: 'all',
    subValue: {
      coordinates: [105.92668850793461, 20.66753069416302],
      type: 'Point',
    },
    value: {
      lat: 20.66753069416302,
      lng: 105.92668850793461,
    },
  },
  {
    id: 'Email',
    side: 'all',
    value: {
      emailList: ['trnthang@gmail.com'],
      isNotifyEmail: true,
    },
  },
];
