const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5bf8d424f395e00286d9da87'),
    name: 'DL 3',
    readDataRate: '1',
    sendDataRate: '1',
    memoryStorage: '1',
    manufacturedDate: new Date('2018-11-24T11:30:52'),
    setupDate: new Date('2018-11-24T11:30:52'),
    operatingTemperature: 11,
    operatingPressure: 11,
    environmentalRating: 'IP66',
    powerSource: [
      'resources.dataloggers.fields.gridPower',
      'resources.dataloggers.fields.battery',
      'resources.dataloggers.fields.solar',
    ],
    lastChargeBattery: new Date('2018-11-24T11:30:52'),
    materialStatus: '1',
    position: {
      lng: 105.93780358209233,
      lat: 20.660288343516054,
    },
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
    inputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
    outputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
  },

  {
    id: new ObjectId('5bea401db994740ba99f6074'),
    name: 'DL 02',
    readDataRate: '2',
    sendDataRate: '2',
    memoryStorage: '2',
    manufacturedDate: new Date('2018-11-13T10:07:20'),
    setupDate: new Date('2018-11-13T10:07:20'),
    operatingPressure: null,
    environmentalRating: 'IP65',
    powerSource: ['resources.dataloggers.fields.gridPower'],
    batteryLife: 12,
    lastChargeBattery: new Date('2018-11-13T10:07:20'),
    materialStatus: '4',
    position: {
      lng: 105.93655903710942,
      lat: 20.672013269857747,
    },
    waterSourceId: new ObjectId('5be7d5c96c225b401e1f8a15'),
    inputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
    outputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
  },

  {
    id: new ObjectId('5be79e116c225b401e1f89e1'),
    name: 'DL 01',
    readDataRate: '1',
    sendDataRate: '1',
    memoryStorage: '1',
    manufacturedDate: new Date('2018-11-11T10:11:46'),
    setupDate: new Date('2018-11-11T10:11:46'),
    operatingTemperature: 1,
    operatingPressure: 1,
    environmentalRating: 'IP66',
    powerSource: ['resources.dataloggers.fields.gridPower'],
    batteryLife: 1,
    lastChargeBattery: new Date('2018-11-11T10:11:46'),
    materialStatus: '3',
    position: {
      lng: 105.9435971535645,
      lat: 20.6554696182846,
    },
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
    inputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
    outputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
  },
];
module.exports = {
  init: async app => {
    let model = app.models.DataLogger;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc DataLogger error', err) : console.log('init wsrc DataLogger OK!')), // eslint-disable-line no-console
    );
  },
};
