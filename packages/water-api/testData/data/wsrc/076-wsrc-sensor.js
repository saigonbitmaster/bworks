const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  {
    id: new ObjectId('5be79de36c225b401e1f89e0'),
    name: '1',
    typeOfSensor: '1',
    manufacturedDate: new Date('2018-11-11T10:11:03'),
    setupDate: new Date('2018-11-11T10:11:03'),
    operatingTemperature: 1,
    environmentalRating: 'IP68',
    hasBuiltinDataLogger: true,
    lastChargeBattery: new Date('2018-11-11T10:11:03'),
    materialStatus: '1',
    position: {
      lng: 105.93029339685063,
      lat: 20.651534212675788,
    },
    dataLoggerId: new ObjectId('5be79e116c225b401e1f89e1'),
    waterSourceId: new ObjectId('5be79d976c225b401e1f89de'),
    inputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
    outputOptionIds: ['5e0ab740eb66630a6d5479fb', '5e0ab728eb66630a6d5479fa'],
  },
];
module.exports = {
  init: async app => {
    let model = app.models.Sensor;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init wsrc sensor error', err) : console.log('init wsrc sensor OK!')), // eslint-disable-line no-console
    );
  },
};
