const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/18/2019, 5:36:18 PM*/
  {
    id: new ObjectId('5dfa0122d9fa274572c1c952'),
    name: 'ten cn dn 2',
    initValue: 10000,
    adjustValue: 0,
    type: 'ElectricLogger',
    dom: new Date('2019-09-01T00:00:00'),
    importDate: new Date('2019-12-18T17:35:50'),
    egeTime: 24,
    usedTime: 0,
    detailTypeId: 'ElectricLogger-loai-cb-dn-2',
    description: '',
  },

  /* 2 createdAt:12/18/2019, 4:51:59 PM*/
  {
    id: new ObjectId('5df9f6bf0e80eb3feeba3f91'),
    name: 'ten cb dn 1',
    initValue: 1000,
    adjustValue: 0,
    type: 'ElectricLogger',
    dom: new Date('2019-06-01T00:00:00'),
    importDate: new Date('2019-12-18T16:51:33'),
    egeTime: 12,
    usedTime: 0,
    detailTypeId: 'ElectricLogger-loai-cb-dn-1',
    description: '',
  },

  /* 3 createdAt:10/11/2019, 4:42:06 PM*/
  {
    id: new ObjectId('5da04e6ea595c10aea9af980'),
    name: 'ten data AAA',
    initValue: 700,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2019-10-11T16:41:40'),
    importDate: new Date('2019-10-11T16:41:40'),
    egeTime: 24,
    usedTime: 0,
    detailTypeId: 'FlowLogger-loai-data-A',
    description: '',
  },

  /* 4 createdAt:10/9/2019, 9:58:55 AM*/
  {
    id: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    name: 'ten logger a',
    initValue: 1000,
    adjustValue: 6,
    type: 'FlowLogger',
    dom: new Date('2018-07-01T00:00:00'),
    importDate: new Date('2019-10-09T09:57:45'),
    egeTime: 36,
    usedTime: 5,
    detailTypeId: 'FlowLogger-loai-data-A',
    description: '',
  },

  /* 5 createdAt:9/26/2019, 4:41:51 PM*/
  {
    id: new ObjectId('5d8c87dfd426fc7ad0c3119d'),
    name: 'Jet 60',
    initValue: 12,
    adjustValue: 0,
    type: 'Pump',
    dom: new Date('2019-06-01T00:00:00'),
    importDate: new Date('2019-07-01T00:00:00'),
    egeTime: 60,
    usedTime: 0,
    detailTypeId: 'Pump-Jet-60',
    description: '',
  },

  /* 6 createdAt:9/26/2019, 1:48:08 PM*/
  {
    id: new ObjectId('5d8c5f28d426fc7ad0c31199'),
    name: 'ABB LOG A',
    initValue: 20,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2018-06-01T00:00:00'),
    importDate: new Date('2018-07-01T00:00:00'),
    egeTime: 60,
    usedTime: 0,
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    description: '',
  },

  /* 7 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf86'),
    name: 'Power Generator 10KVA',
    initValue: 96,
    adjustValue: 0,
    type: 'Other',
    dom: new Date('2019-01-11T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Other-Power-Generator-10KVA',
    description: '',
  },

  /* 8 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf85'),
    name: 'VABB D600',
    initValue: 95,
    adjustValue: 0,
    type: 'Valve',
    dom: new Date('2019-01-03T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Valve-VABB-D600',
    description: '',
  },

  /* 9 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf84'),
    name: 'VABB D400',
    initValue: 115,
    adjustValue: 0,
    type: 'Valve',
    dom: new Date('2019-01-26T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Valve-VABB-D400',
    description: '',
  },

  /* 10 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf83'),
    name: 'VABB D300',
    initValue: 115,
    adjustValue: 0,
    type: 'Valve',
    dom: new Date('2019-01-07T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Valve-VABB-D300',
    description: '',
  },

  /* 11 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf82'),
    name: 'VABB D100',
    initValue: 84,
    adjustValue: 0,
    type: 'Valve',
    dom: new Date('2019-01-05T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Valve-VABB-D100',
    description: '',
  },

  /* 12 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf81'),
    name: 'GES 2000',
    initValue: 108,
    adjustValue: 0,
    type: 'Tank',
    dom: new Date('2019-01-09T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Tank-GES-2000',
    description: '',
  },

  /* 13 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf80'),
    name: 'GES 1000',
    initValue: 85,
    adjustValue: 0,
    type: 'Tank',
    dom: new Date('2019-01-14T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Tank-GES-1000',
    description: '',
  },

  /* 14 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7f'),
    name: 'Jet 60',
    initValue: 91,
    adjustValue: 0,
    type: 'Pump',
    dom: new Date('2019-01-02T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'Pump-Jet-60',
    description: '',
  },

  /* 15 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7e'),
    name: 'Jet 40',
    initValue: 115,
    adjustValue: 0,
    type: 'Pump',
    dom: new Date('2019-01-22T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Pump-Jet-40',
    description: '',
  },

  /* 16 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7d'),
    name: 'Jet 30',
    initValue: 106,
    adjustValue: 0,
    type: 'Pump',
    dom: new Date('2019-01-21T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Pump-Jet-30',
    description: '',
  },

  /* 17 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7c'),
    name: 'Jet 10',
    initValue: 97,
    adjustValue: 0,
    type: 'Pump',
    dom: new Date('2019-01-04T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'Pump-Jet-10',
    description: '',
  },

  /* 18 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7b'),
    name: 'FSF DN60',
    initValue: 116,
    adjustValue: 0,
    type: 'PressureReducing',
    dom: new Date('2019-01-07T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'PressureReducing-FSF-DN60',
    description: '',
  },

  /* 19 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf7a'),
    name: 'FSF DN40',
    initValue: 113,
    adjustValue: 0,
    type: 'PressureReducing',
    dom: new Date('2019-01-19T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'PressureReducing-FSF-DN40',
    description: '',
  },

  /* 20 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf79'),
    name: 'FSF DN30',
    initValue: 119,
    adjustValue: 0,
    type: 'PressureReducing',
    dom: new Date('2019-01-04T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'PressureReducing-FSF-DN30',
    description: '',
  },

  /* 21 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf78'),
    name: 'FSF DN10',
    initValue: 119,
    adjustValue: 0,
    type: 'PressureReducing',
    dom: new Date('2019-01-27T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'PressureReducing-FSF-DN10',
    description: '',
  },

  /* 22 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf77'),
    name: 'SF DN60',
    initValue: 93,
    adjustValue: 0,
    type: 'Filter',
    dom: new Date('2019-01-18T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Filter-SF-DN60',
    description: '',
  },

  /* 23 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf76'),
    name: 'SF DN40',
    initValue: 116,
    adjustValue: 0,
    type: 'Filter',
    dom: new Date('2019-01-03T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Filter-SF-DN40',
    description: '',
  },

  /* 24 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf75'),
    name: 'SF DN30',
    initValue: 98,
    adjustValue: 0,
    type: 'Filter',
    dom: new Date('2019-01-27T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'Filter-SF-DN30',
    description: '',
  },

  /* 25 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf74'),
    name: 'SF DN10',
    initValue: 82,
    adjustValue: 0,
    type: 'Filter',
    dom: new Date('2019-01-28T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Filter-SF-DN10',
    description: '',
  },

  /* 26 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf73'),
    name: 'ABB DN60',
    initValue: 85,
    adjustValue: 0,
    type: 'Meter',
    dom: new Date('2019-01-26T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'Meter-ABB-DN60',
    description: '',
  },

  /* 27 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf72'),
    name: 'ABB DN40',
    initValue: 106,
    adjustValue: 0,
    type: 'Meter',
    dom: new Date('2019-01-22T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Meter-ABB-DN40',
    description: '',
  },

  /* 28 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf71'),
    name: 'ABB DN30',
    initValue: 90,
    adjustValue: 0,
    type: 'Meter',
    dom: new Date('2019-01-13T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'Meter-ABB-DN30',
    description: '',
  },

  /* 29 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf70'),
    name: 'ABB DN10',
    initValue: 89,
    adjustValue: 0,
    type: 'Meter',
    dom: new Date('2019-02-01T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Meter-ABB-DN10',
    description: '',
  },

  /* 30 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6f'),
    name: 'AQUA TROLL 600',
    initValue: 102,
    adjustValue: 0,
    type: 'QualityLogger',
    dom: new Date('2019-01-05T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'QualityLogger-AQUA-TROLL-600',
    description: '',
  },

  /* 31 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6e'),
    name: 'YSI EXO2',
    initValue: 92,
    adjustValue: 0,
    type: 'QualityLogger',
    dom: new Date('2019-01-12T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'QualityLogger-YSI-EXO2',
    description: '',
  },

  /* 32 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6d'),
    name: 'ABB LOG B',
    initValue: 88,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2019-01-08T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    description: '',
  },

  /* 33 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6c'),
    name: 'ABB LOG A',
    initValue: 100,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2019-01-22T00:00:00'),
    egeTime: 108,
    usedTime: 0,
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    description: '',
  },

  /* 34 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6b'),
    name: 'EMS GTI 5',
    initValue: 111,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2019-01-29T00:00:00'),
    egeTime: 132,
    usedTime: 0,
    detailTypeId: 'FlowLogger-EMS-GTI-5',
    description: '',
  },

  /* 35 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf6a'),
    name: 'EMS GTI 4',
    initValue: 113,
    adjustValue: 0,
    type: 'FlowLogger',
    dom: new Date('2019-01-15T00:00:00'),
    egeTime: 96,
    usedTime: 0,
    detailTypeId: 'FlowLogger-EMS-GTI-4',
    description: '',
  },

  /* 36 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf69'),
    name: 'Ống Gang DN-600',
    initValue: 94387,
    adjustValue: 0,
    type: 'Pipe',
    dom: new Date('2019-01-13T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Pipe-Ong-Gang-DN-600',
    description: '',
  },

  /* 37 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf68'),
    name: 'Ống Gang DN-400',
    initValue: 80894,
    adjustValue: 0,
    type: 'Pipe',
    dom: new Date('2019-01-04T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    description: '',
  },

  /* 38 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf67'),
    name: 'Ống Gang DN-300',
    initValue: 95770,
    adjustValue: 0,
    type: 'Pipe',
    dom: new Date('2019-01-22T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    description: '',
  },

  /* 39 createdAt:7/18/2018, 9:58:17 AM*/
  {
    id: new ObjectId('5b4eacc952ea8304d082bf66'),
    name: 'Ống Gang DN-100',
    initValue: 83782,
    adjustValue: 0,
    type: 'Pipe',
    dom: new Date('2019-01-16T00:00:00'),
    egeTime: 120,
    usedTime: 0,
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.MaterialStock;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms MaterialStock error', err) : console.log('init MaterialStock OK!')), // eslint-disable-line no-console
    );
  },
};
