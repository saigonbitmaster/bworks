const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/18/2019, 5:36:39 PM*/
  {
    id: new ObjectId('5dfa0137d9fa274572c1c953'),
    name: 'ten cn dn 2',
    type: 'ElectricLogger',
    exportValue: 200,
    currentValue: 199,
    exportDate: new Date('2019-12-18T17:36:27'),
    detailTypeId: 'ElectricLogger-loai-cb-dn-2',
    stockId: new ObjectId('5dfa0122d9fa274572c1c952'),
    description: '',
  },

  /* 2 createdAt:12/18/2019, 4:52:23 PM*/
  {
    id: new ObjectId('5df9f6d70e80eb3feeba3f92'),
    name: 'ten cb dn 1',
    type: 'ElectricLogger',
    exportValue: 100,
    currentValue: 99,
    exportDate: new Date('2019-12-18T16:52:13'),
    detailTypeId: 'ElectricLogger-loai-cb-dn-1',
    stockId: new ObjectId('5df9f6bf0e80eb3feeba3f91'),
    description: '',
  },

  /* 3 createdAt:10/11/2019, 4:42:31 PM*/
  {
    id: new ObjectId('5da04e87a595c10aea9af981'),
    name: 'ten data AAA',
    type: 'FlowLogger',
    exportValue: 1,
    currentValue: 1,
    exportDate: new Date('2019-10-11T16:42:20'),
    detailTypeId: 'FlowLogger-loai-data-A',
    stockId: new ObjectId('5da04e6ea595c10aea9af980'),
    description: '',
  },

  /* 4 createdAt:10/11/2019, 4:35:52 PM*/
  {
    id: new ObjectId('5da04cf8a595c10aea9af97f'),
    name: 'ten logger a',
    type: 'FlowLogger',
    exportValue: 500,
    currentValue: 497,
    exportDate: new Date('2019-10-11T16:35:42'),
    detailTypeId: 'FlowLogger-loai-data-A',
    stockId: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    description: '',
  },

  /* 5 createdAt:10/9/2019, 10:02:10 AM*/
  {
    id: new ObjectId('5d9d4db2d084971b88fb4f20'),
    name: 'ten logger a',
    type: 'FlowLogger',
    exportValue: 200,
    currentValue: 200,
    exportDate: new Date('2019-10-09T10:01:50'),
    detailTypeId: 'FlowLogger-loai-data-A',
    stockId: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    description: '',
  },

  /* 6 createdAt:9/26/2019, 1:50:06 PM*/
  {
    id: new ObjectId('5d8c5f9ed426fc7ad0c3119a'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    exportValue: 15,
    currentValue: 15,
    exportDate: new Date('2018-09-01T00:00:00'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    stockId: new ObjectId('5d8c5f28d426fc7ad0c31199'),
    description: '',
  },

  /* 7 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d30717a3'),
    name: 'Power Generator 10KVA',
    type: 'Other',
    exportValue: 65,
    currentValue: 65,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Other-Power-Generator-10KVA',
    stockId: new ObjectId('5b4eacc952ea8304d082bf86'),
    description: '',
  },

  /* 8 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d30717a2'),
    name: 'VABB D600',
    type: 'Valve',
    exportValue: 75,
    currentValue: 75,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Valve-VABB-D600',
    stockId: new ObjectId('5b4eacc952ea8304d082bf85'),
    description: '',
  },

  /* 9 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d30717a1'),
    name: 'VABB D400',
    type: 'Valve',
    exportValue: 111,
    currentValue: 111,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Valve-VABB-D400',
    stockId: new ObjectId('5b4eacc952ea8304d082bf84'),
    description: '',
  },

  /* 10 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d30717a0'),
    name: 'VABB D300',
    type: 'Valve',
    exportValue: 108,
    currentValue: 108,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Valve-VABB-D300',
    stockId: new ObjectId('5b4eacc952ea8304d082bf83'),
    description: '',
  },

  /* 11 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179f'),
    name: 'VABB D100',
    type: 'Valve',
    exportValue: 55,
    currentValue: 55,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Valve-VABB-D100',
    stockId: new ObjectId('5b4eacc952ea8304d082bf82'),
    description: '',
  },

  /* 12 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179e'),
    name: 'GES 2000',
    type: 'Tank',
    exportValue: 79,
    currentValue: 79,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Tank-GES-2000',
    stockId: new ObjectId('5b4eacc952ea8304d082bf81'),
    description: '',
  },

  /* 13 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179d'),
    name: 'GES 1000',
    type: 'Tank',
    exportValue: 77,
    currentValue: 77,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Tank-GES-1000',
    stockId: new ObjectId('5b4eacc952ea8304d082bf80'),
    description: '',
  },

  /* 14 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179c'),
    name: 'Jet 60',
    type: 'Pump',
    exportValue: 56,
    currentValue: 56,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Pump-Jet-60',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7f'),
    description: '',
  },

  /* 15 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179b'),
    name: 'Jet 40',
    type: 'Pump',
    exportValue: 104,
    currentValue: 104,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Pump-Jet-40',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7e'),
    description: '',
  },

  /* 16 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d307179a'),
    name: 'Jet 30',
    type: 'Pump',
    exportValue: 82,
    currentValue: 82,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Pump-Jet-30',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7d'),
    description: '',
  },

  /* 17 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d3071799'),
    name: 'Jet 10',
    type: 'Pump',
    exportValue: 60,
    currentValue: 60,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Pump-Jet-10',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7c'),
    description: '',
  },

  /* 18 createdAt:7/18/2018, 9:58:26 AM*/
  {
    id: new ObjectId('5b4eacd20008dc04d3071798'),
    name: 'FSF DN60',
    type: 'PressureReducing',
    exportValue: 92,
    currentValue: 92,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'PressureReducing-FSF-DN60',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7b'),
    description: '',
  },

  /* 19 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071797'),
    name: 'FSF DN40',
    type: 'PressureReducing',
    exportValue: 68,
    currentValue: 68,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'PressureReducing-FSF-DN40',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7a'),
    description: '',
  },

  /* 20 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071796'),
    name: 'FSF DN30',
    type: 'PressureReducing',
    exportValue: 88,
    currentValue: 88,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'PressureReducing-FSF-DN30',
    stockId: new ObjectId('5b4eacc952ea8304d082bf79'),
    description: '',
  },

  /* 21 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071795'),
    name: 'FSF DN10',
    type: 'PressureReducing',
    exportValue: 108,
    currentValue: 108,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'PressureReducing-FSF-DN10',
    stockId: new ObjectId('5b4eacc952ea8304d082bf78'),
    description: '',
  },

  /* 22 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071794'),
    name: 'SF DN60',
    type: 'Filter',
    exportValue: 74,
    currentValue: 74,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Filter-SF-DN60',
    stockId: new ObjectId('5b4eacc952ea8304d082bf77'),
    description: '',
  },

  /* 23 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071793'),
    name: 'SF DN40',
    type: 'Filter',
    exportValue: 106,
    currentValue: 106,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Filter-SF-DN40',
    stockId: new ObjectId('5b4eacc952ea8304d082bf76'),
    description: '',
  },

  /* 24 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071792'),
    name: 'SF DN30',
    type: 'Filter',
    exportValue: 86,
    currentValue: 86,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Filter-SF-DN30',
    stockId: new ObjectId('5b4eacc952ea8304d082bf75'),
    description: '',
  },

  /* 25 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071791'),
    name: 'SF DN10',
    type: 'Filter',
    exportValue: 52,
    currentValue: 52,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Filter-SF-DN10',
    stockId: new ObjectId('5b4eacc952ea8304d082bf74'),
    description: '',
  },

  /* 26 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071790'),
    name: 'ABB DN60',
    type: 'Meter',
    exportValue: 53,
    currentValue: 53,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Meter-ABB-DN60',
    stockId: new ObjectId('5b4eacc952ea8304d082bf73'),
    description: '',
  },

  /* 27 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178f'),
    name: 'ABB DN40',
    type: 'Meter',
    exportValue: 101,
    currentValue: 101,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Meter-ABB-DN40',
    stockId: new ObjectId('5b4eacc952ea8304d082bf72'),
    description: '',
  },

  /* 28 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178e'),
    name: 'ABB DN30',
    type: 'Meter',
    exportValue: 54,
    currentValue: 54,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Meter-ABB-DN30',
    stockId: new ObjectId('5b4eacc952ea8304d082bf71'),
    description: '',
  },

  /* 29 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178d'),
    name: 'ABB DN10',
    type: 'Meter',
    exportValue: 63,
    currentValue: 63,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'Meter-ABB-DN10',
    stockId: new ObjectId('5b4eacc952ea8304d082bf70'),
    description: '',
  },

  /* 30 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178c'),
    name: 'AQUA TROLL 600',
    type: 'QualityLogger',
    exportValue: 80,
    currentValue: 80,
    exportDate: new Date('2020-01-03T10:20:35'),
    detailTypeId: 'QualityLogger-AQUA-TROLL-600',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6f'),
    description: '',
  },

  /* 31 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178b'),
    name: 'YSI EXO2',
    type: 'QualityLogger',
    exportValue: 70,
    currentValue: 70,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'QualityLogger-YSI-EXO2',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6e'),
    description: '',
  },

  /* 32 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d307178a'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    exportValue: 79,
    currentValue: 79,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    description: '',
  },

  /* 33 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071789'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    exportValue: 79,
    currentValue: 79,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    description: '',
  },

  /* 34 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071788'),
    name: 'EMS GTI 5',
    type: 'FlowLogger',
    exportValue: 77,
    currentValue: 77,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'FlowLogger-EMS-GTI-5',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6b'),
    description: '',
  },

  /* 35 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071787'),
    name: 'EMS GTI 4',
    type: 'FlowLogger',
    exportValue: 73,
    currentValue: 73,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'FlowLogger-EMS-GTI-4',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6a'),
    description: '',
  },

  /* 36 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071786'),
    name: 'Ống Gang DN-600',
    type: 'Pipe',
    exportValue: 78750,
    currentValue: 78750,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'Pipe-Ong-Gang-DN-600',
    stockId: new ObjectId('5b4eacc952ea8304d082bf69'),
    description: '',
  },

  /* 37 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071785'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    exportValue: 51293,
    currentValue: 51293,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    description: '',
  },

  /* 38 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071784'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    exportValue: 65900,
    currentValue: 65900,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    description: '',
  },

  /* 39 createdAt:7/18/2018, 9:58:25 AM*/
  {
    id: new ObjectId('5b4eacd10008dc04d3071783'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    exportValue: 79281,
    currentValue: 79281,
    exportDate: new Date('2020-01-03T10:20:34'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.MaterialExport;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms MaterialExport error', err) : console.log('init MaterialExport OK!')), // eslint-disable-line no-console
    );
  },
};
