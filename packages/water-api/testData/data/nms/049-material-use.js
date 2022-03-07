const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const ObjectId = require('mongodb').ObjectID;
const data = [
  /* 1 createdAt:12/18/2019, 5:42:54 PM*/
  {
    id: new ObjectId('5dfa02aed9fa274572c1c963'),
    name: 'Jet 10',
    type: 'Pump',
    meta: {
      diameter: 333,
      capacity: 444,
      powerConsumption: 33,
    },
    health: 'OK',
    node: {
      lng: 105.91401911454602,
      lat: 20.66925410146523,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'Pump-Jet-10',
    fromNodeId: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    useStartDate: '2019-12-18T10:42:23.714Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7c'),
    exportId: new ObjectId('5b4eacd20008dc04d3071799'),
    electricLoggerId: new ObjectId('5df9fa690e80eb3feeba3f98'),
    description: '',
    pumpStationId: new ObjectId('5df99e2f891a6406abafaf10'),
  },

  /* 2 createdAt:12/18/2019, 5:37:49 PM*/
  {
    id: new ObjectId('5dfa017dd9fa274572c1c960'),
    name: 'ten cn dn 2',
    type: 'ElectricLogger',
    health: 'OK',
    optionKey: 'DN001',
    node: {
      lng: 105.91607615887199,
      lat: 20.660349583945873,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'ElectricLogger-loai-cb-dn-2',
    fromNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    useStartDate: '2019-12-18T10:37:08.709Z',
    stockId: new ObjectId('5dfa0122d9fa274572c1c952'),
    exportId: new ObjectId('5dfa0137d9fa274572c1c953'),
    description: '',
  },

  /* 3 createdAt:12/18/2019, 5:30:04 PM*/
  {
    id: new ObjectId('5df9ffacd9fa274572c1c951'),
    name: 'Jet 60',
    type: 'Pump',
    meta: {
      diameter: 22,
      capacity: 33,
      powerConsumption: 33,
    },
    health: 'OK',
    node: {
      lng: 105.9016594954054,
      lat: 20.636646337199988,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'Pump-Jet-60',
    fromNodeId: new ObjectId('5b4f1c706339ec2a4228ae2b'),
    useStartDate: '2019-12-18T10:24:16.446Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7f'),
    exportId: new ObjectId('5b4eacd20008dc04d307179c'),
    electricLoggerId: new ObjectId('5dfa017dd9fa274572c1c960'),
    description: '',
    pumpStationId: new ObjectId('5df9a22e464ccc238313d007'),
  },

  /* 4 createdAt:12/18/2019, 5:07:37 PM*/
  {
    id: new ObjectId('5df9fa690e80eb3feeba3f98'),
    name: 'ten cb dn 1',
    type: 'ElectricLogger',
    health: 'OK',
    optionKey: 'id electric logger1',
    node: {
      lng: 107.01045659277338,
      lat: 21.031837691158746,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'ElectricLogger-loai-cb-dn-1',
    fromNodeId: new ObjectId('5dc133cb26b94125e797e348'),
    useStartDate: '2019-12-18T10:07:08.991Z',
    stockId: new ObjectId('5df9f6bf0e80eb3feeba3f91'),
    exportId: new ObjectId('5df9f6d70e80eb3feeba3f92'),
    description: '',
  },

  /* 5 createdAt:12/18/2019, 10:53:46 AM*/
  {
    id: new ObjectId('5df9a2ca464ccc238313d008'),
    name: 'Jet 10',
    type: 'Pump',
    meta: {
      diameter: 100,
      capacity: 220,
      powerConsumption: 30,
    },
    health: 'BAD',
    node: {
      lng: 105.89753049079513,
      lat: 20.666203246082276,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'Pump-Jet-10',
    fromNodeId: new ObjectId('5b4f1d266339ec2a4228ae30'),
    useStartDate: '2019-12-18T03:52:43.803Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7c'),
    exportId: new ObjectId('5b4eacd20008dc04d3071799'),
    description: '<p>test</p>',
    pumpStationId: new ObjectId('5df99e2f891a6406abafaf10'),
    isDeleted: true,
  },

  /* 6 createdAt:11/26/2019, 2:35:10 PM*/
  {
    id: new ObjectId('5ddcd5ae32abc11a929886af'),
    name: 'AQUA TROLL 600',
    type: 'QualityLogger',
    health: 'OK',
    optionKey: 'idtest1',
    node: {
      lng: 107.01045659277338,
      lat: 21.031837691158746,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'QualityLogger-AQUA-TROLL-600',
    fromNodeId: new ObjectId('5dc133cb26b94125e797e348'),
    useStartDate: '2019-11-26T07:34:50.314Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6f'),
    exportId: new ObjectId('5b4eacd10008dc04d307178c'),
    description: '',
    waterParameter: ['ph', 'cod', 'ntu'],
  },

  /* 7 createdAt:10/23/2019, 2:50:59 PM*/
  {
    id: new ObjectId('5db006635cb30e1623a51148'),
    name: 'ten logger a',
    type: 'FlowLogger',
    meta: {
      designFlow: 2,
      designPressure: 2,
    },
    health: 'BAD',
    optionKey: '77777',
    node: {
      lng: 105.92337465958997,
      lat: 20.639056017200957,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'FlowLogger-loai-data-A',
    fromNodeId: new ObjectId('5b4f1c576339ec2a4228ae29'),
    useStartDate: '2019-10-23T07:50:15.486Z',
    stockId: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    exportId: new ObjectId('5da04cf8a595c10aea9af97f'),
    description: '',
    isDeleted: true,
  },

  /* 8 createdAt:10/23/2019, 2:29:48 PM*/
  {
    id: new ObjectId('5db0016c9989c415352ea498'),
    name: 'ten logger a',
    type: 'FlowLogger',
    meta: {
      designFlow: 22,
      designPressure: 22,
    },
    health: 'BAD',
    optionKey: 'aaaaa1111',
    node: {
      lng: 105.89753049079513,
      lat: 20.666203246082276,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'FlowLogger-loai-data-A',
    fromNodeId: new ObjectId('5b4f1d266339ec2a4228ae30'),
    useStartDate: '2019-10-23T07:29:19.023Z',
    stockId: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    exportId: new ObjectId('5da04cf8a595c10aea9af97f'),
    description: '',
    isDeleted: true,
  },

  /* 9 createdAt:10/22/2019, 1:47:41 PM*/
  {
    id: new ObjectId('5daea60db1519502fac8bc5a'),
    name: 'ten logger a',
    type: 'FlowLogger',
    meta: {
      designFlow: 2,
      designPressure: 3,
    },
    health: 'BAD',
    optionKey: '1112233',
    node: {
      lng: 105.94328737931653,
      lat: 20.6179298567822,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'FlowLogger-loai-data-A',
    fromNodeId: new ObjectId('5b4efbeb6339ec2a4228adfd'),
    useStartDate: '2019-10-22T06:47:07.422Z',
    stockId: new ObjectId('5d9d4cefd084971b88fb4f0a'),
    exportId: new ObjectId('5da04cf8a595c10aea9af97f'),
    description: '',
    isDeleted: true,
  },

  /* 10 createdAt:10/3/2019, 4:12:04 PM*/
  {
    id: new ObjectId('5d95bb64498510111b7387be'),
    name: 'VABB D600',
    type: 'Valve',
    meta: {
      diameter: 600,
    },
    health: 'OK',
    node: {
      lng: 105.89753049079513,
      lat: 20.666203246082276,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'Valve-VABB-D600',
    fromNodeId: new ObjectId('5b4f1d266339ec2a4228ae30'),
    useStartDate: '2019-08-31T17:00:00.000Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf85'),
    exportId: new ObjectId('5b4eacd20008dc04d30717a2'),
    description: '',
  },

  /* 11 createdAt:9/30/2019, 3:27:56 PM*/
  {
    id: new ObjectId('5d91bc8c85098f27f7d05fd2'),
    name: 'ABB DN60',
    type: 'Meter',
    meta: {
      diameter: 22,
      accuracy: 33,
    },
    health: 'OK',
    node: {
      lng: 105.9367847442627,
      lat: 20.644471138712216,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'Meter-ABB-DN60',
    fromNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    useStartDate: '2019-09-30T08:27:33.650Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf73'),
    exportId: new ObjectId('5b4eacd10008dc04d3071790'),
    description: '',
  },

  /* 12 createdAt:9/25/2019, 2:34:03 PM*/
  {
    id: new ObjectId('5d8b186b4951394629da6b86'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    meta: {
      designFlow: 50000,
      designPressure: 3.5,
    },
    health: 'OK',
    optionKey: 'DV001',
    node: {
      lng: 105.93278248681645,
      lat: 20.659967099921115,
    },
    dmaId: new ObjectId('5b447dee21c0782a6f4a7550'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef6386339ec2a4228ade8'),
    useStartDate: '2019-08-31T17:00:00.000Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 13 createdAt:9/25/2019, 2:32:32 PM*/
  {
    id: new ObjectId('5d8b18104951394629da6b7d'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    meta: {
      designFlow: 45000,
      designPressure: 3,
    },
    health: 'OK',
    optionKey: 'DH001',
    node: {
      lng: 105.91367511792669,
      lat: 20.64455607605854,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef6756339ec2a4228adeb'),
    useStartDate: '2019-08-31T17:00:00.000Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 14 createdAt:7/18/2018, lat: 5:59:08 PM*/
  {
    id: new ObjectId('5b4f1d7c6339ec2a4228ae31'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.91401911454602,
      lat: 20.66925410146523,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    toNodeId: new ObjectId('5b4f1d266339ec2a4228ae30'),
    useStartDate: '2018-07-18T10:58:46.874Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 2149,
    polyline: [
      {
        lat: 20.66925410146523,
        lng: 105.91401911454602,
      },
      {
        lat: 20.66885007523397,
        lng: 105.91278855789801,
      },
      {
        lat: 20.667966703500426,
        lng: 105.91029946793219,
      },
      {
        lat: 20.6668424047726,
        lng: 105.90866868485114,
      },
      {
        lat: 20.664915016163867,
        lng: 105.90738122452399,
      },
      {
        lat: 20.663308840309394,
        lng: 105.90652291763922,
      },
      {
        lat: 20.662907293692424,
        lng: 105.90308969010016,
      },
      {
        lat: 20.663148221789967,
        lng: 105.9014589070191,
      },
      {
        lat: 20.664834707774464,
        lng: 105.8985406636109,
      },
      {
        lat: 20.666203246082276,
        lng: 105.89753049079513,
      },
    ],
  },

  /* 15 createdAt:7/18/2018, lat: 5:56:47 PM*/
  {
    id: new ObjectId('5b4f1cef6339ec2a4228ae2f'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.93056297974988,
      lat: 20.616142433033374,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4f1c4c6339ec2a4228ae28'),
    toNodeId: new ObjectId('5b4f1c576339ec2a4228ae29'),
    useStartDate: '2018-07-18T10:56:24.883Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 2833,
    polyline: [
      {
        lat: 20.616142433033374,
        lng: 105.93056297974988,
      },
      {
        lat: 20.61640351870948,
        lng: 105.92895365434094,
      },
      {
        lat: 20.61801018994122,
        lng: 105.92680788712903,
      },
      {
        lat: 20.62202679385936,
        lng: 105.92594958024426,
      },
      {
        lat: 20.624436705351407,
        lng: 105.92517710404798,
      },
      {
        lat: 20.627007235561265,
        lng: 105.92483378129407,
      },
      {
        lat: 20.630059683804202,
        lng: 105.9239754744093,
      },
      {
        lat: 20.63246946812001,
        lng: 105.92337465958997,
      },
      {
        lat: 20.636405367100622,
        lng: 105.92303133683606,
      },
      {
        lat: 20.639056017200957,
        lng: 105.92337465958997,
      },
    ],
  },

  /* 16 createdAt:7/18/2018, lat: 5:56:01 PM*/
  {
    id: new ObjectId('5b4f1cc16339ec2a4228ae2e'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.94328737931653,
      lat: 20.6179298567822,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4efbeb6339ec2a4228adfd'),
    toNodeId: new ObjectId('5b4f1c4c6339ec2a4228ae28'),
    useStartDate: '2018-07-18T10:55:41.642Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 1375,
    polyline: [
      {
        lat: 20.6179298567822,
        lng: 105.94328737931653,
      },
      {
        lat: 20.617126522861334,
        lng: 105.94165659623548,
      },
      {
        lat: 20.61680518810648,
        lng: 105.94028330521985,
      },
      {
        lat: 20.6165641865954,
        lng: 105.93916750626965,
      },
      {
        lat: 20.615921514034753,
        lng: 105.93667841630383,
      },
      {
        lat: 20.615760845470852,
        lng: 105.93418932633801,
      },
      {
        lat: 20.615760845470852,
        lng: 105.93135691361829,
      },
      {
        lat: 20.616142433033374,
        lng: 105.93056297974988,
      },
    ],
  },

  /* 17 createdAt:7/18/2018, lat: 5:55:37 PM*/
  {
    id: new ObjectId('5b4f1ca96339ec2a4228ae2d'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.9056935377638,
      lat: 20.618813519200682,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4f1c646339ec2a4228ae2a'),
    toNodeId: new ObjectId('5b4f1c706339ec2a4228ae2b'),
    useStartDate: '2018-07-18T10:55:17.433Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 2286,
    polyline: [
      {
        lat: 20.618813519200682,
        lng: 105.9056935377638,
      },
      {
        lat: 20.619777508718165,
        lng: 105.90354777055188,
      },
      {
        lat: 20.621625138235384,
        lng: 105.90191698747083,
      },
      {
        lat: 20.623794066016796,
        lng: 105.90045786576673,
      },
      {
        lat: 20.625641646791934,
        lng: 105.89985705094739,
      },
      {
        lat: 20.629658049375067,
        lng: 105.89968538957044,
      },
      {
        lat: 20.633995645115988,
        lng: 105.89985705094739,
      },
      {
        lat: 20.635120186791568,
        lng: 105.90062952714368,
      },
      {
        lat: 20.636646337199988,
        lng: 105.9016594954054,
      },
    ],
  },

  /* 18 createdAt:7/18/2018, lat: 5:55:13 PM*/
  {
    id: new ObjectId('5b4f1c916339ec2a4228ae2c'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.92285708151462,
      lat: 20.61295974014286,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4efbe26339ec2a4228adfc'),
    toNodeId: new ObjectId('5b4f1c646339ec2a4228ae2a'),
    useStartDate: '2018-07-18T10:54:46.948Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 2248,
    polyline: [
      {
        lat: 20.61295974014286,
        lng: 105.92285708151462,
      },
      {
        lat: 20.61202525358207,
        lng: 105.9221730299513,
      },
      {
        lat: 20.611623571579972,
        lng: 105.92097140031262,
      },
      {
        lat: 20.61166373982786,
        lng: 105.91826773362561,
      },
      {
        lat: 20.614073815317166,
        lng: 105.91676569657727,
      },
      {
        lat: 20.61772902369926,
        lng: 105.9141049452345,
      },
      {
        lat: 20.619134849717902,
        lng: 105.91032839494153,
      },
      {
        lat: 20.618853685552423,
        lng: 105.90753889756604,
      },
      {
        lat: 20.618813519200682,
        lng: 105.9056935377638,
      },
    ],
  },

  /* 19 createdAt:7/18/2018, lat: 5:45:13 PM*/
  {
    id: new ObjectId('5b4f1a396339ec2a4228ae27'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91827710046391,
      lat: 20.670407169064056,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4f197b6339ec2a4228ae23'),
    toNodeId: new ObjectId('5b4f1a226339ec2a4228ae26'),
    useStartDate: '2018-07-18T10:44:58.094Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 1116,
    polyline: [
      {
        lat: 20.670407169064056,
        lng: 105.91827710046391,
      },
      {
        lat: 20.66105614283098,
        lng: 105.92227935791016,
      },
    ],
  },

  /* 20 createdAt:7/18/2018, lat: 5:43:09 PM*/
  {
    id: new ObjectId('5b4f19bd6339ec2a4228ae25'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.9340354071478,
      lat: 20.677068489860723,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4efc586339ec2a4228ae00'),
    toNodeId: new ObjectId('5b4f197b6339ec2a4228ae23'),
    useStartDate: '2018-07-18T10:42:32.387Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 1805,
    polyline: [
      {
        lat: 20.677068489860723,
        lng: 105.9340354071478,
      },
      {
        lat: 20.674367230497435,
        lng: 105.92818264905395,
      },
      {
        lat: 20.67268085036048,
        lng: 105.9245348447937,
      },
      {
        lat: 20.671797500909406,
        lng: 105.92114453259887,
      },
      {
        lat: 20.670407169064056,
        lng: 105.91827710046391,
      },
    ],
  },

  /* 21 createdAt:7/18/2018, lat: 4:42:18 PM*/
  {
    id: new ObjectId('5b4f0b7a6339ec2a4228ae22'),
    name: 'Power Generator 10KVA',
    type: 'Other',
    health: 'OK',
    node: {
      lng: 105.9340354071478,
      lat: 20.677068489860723,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Other-Power-Generator-10KVA',
    fromNodeId: new ObjectId('5b4efc586339ec2a4228ae00'),
    useStartDate: '2018-07-18T09:42:00.788Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf86'),
    exportId: new ObjectId('5b4eacd20008dc04d30717a3'),
    description: '',
  },

  /* 22 createdAt:7/18/2018, lat: 4:41:58 PM*/
  {
    id: new ObjectId('5b4f0b666339ec2a4228ae21'),
    name: 'Power Generator 10KVA',
    type: 'Other',
    health: 'OK',
    node: {
      lng: 105.91401911454602,
      lat: 20.66925410146523,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'Other-Power-Generator-10KVA',
    fromNodeId: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    useStartDate: '2018-07-18T09:41:37.929Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf86'),
    exportId: new ObjectId('5b4eacd20008dc04d30717a3'),
    description: '',
  },

  /* 23 createdAt:7/18/2018, lat: 4:29:59 PM*/
  {
    id: new ObjectId('5b4f08976339ec2a4228ae20'),
    name: 'VABB D400',
    type: 'Valve',
    meta: {
      diameter: 1000,
    },
    health: 'OK',
    node: {
      lng: 105.91636226809533,
      lat: 20.6446844704485,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'Valve-VABB-D400',
    fromNodeId: new ObjectId('5b4ef6926339ec2a4228aded'),
    useStartDate: '2018-07-18T09:29:21.672Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf84'),
    exportId: new ObjectId('5b4eacd20008dc04d30717a1'),
    description: '',
  },

  /* 24 createdAt:7/18/2018, lat: 4:29:19 PM*/
  {
    id: new ObjectId('5b4f086f6339ec2a4228ae1f'),
    name: 'VABB D600',
    type: 'Valve',
    meta: {
      diameter: 1000,
    },
    health: 'OK',
    node: {
      lng: 105.93696280977247,
      lat: 20.64807083702256,
    },
    dmaId: new ObjectId('5b448d3a21c0782a6f4a7554'),
    detailTypeId: 'Valve-VABB-D600',
    fromNodeId: new ObjectId('5b4ef6596339ec2a4228ade9'),
    useStartDate: '2018-07-18T09:28:51.606Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf85'),
    exportId: new ObjectId('5b4eacd20008dc04d30717a2'),
    description: '',
  },

  /* 25 createdAt:7/18/2018, lat: 4:28:39 PM*/
  {
    id: new ObjectId('5b4f08476339ec2a4228ae1e'),
    name: 'GES 1000',
    type: 'Tank',
    meta: {
      volume: 10000,
      capacity: 200,
      powerConsumption: 220,
    },
    health: 'OK',
    node: {
      lng: 105.9340354071478,
      lat: 20.677068489860723,
    },
    dmaId: new ObjectId('5b448d3a21c0782a6f4a7554'),
    detailTypeId: 'Tank-GES-1000',
    fromNodeId: new ObjectId('5b4efc586339ec2a4228ae00'),
    useStartDate: '2018-07-18T09:28:15.053Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf80'),
    exportId: new ObjectId('5b4eacd20008dc04d307179d'),
    description: '',
  },

  /* 26 createdAt:7/18/2018, lat: 4:28:12 PM*/
  {
    id: new ObjectId('5b4f082c6339ec2a4228ae1d'),
    name: 'GES 2000',
    type: 'Tank',
    meta: {
      volume: 20000,
      capacity: 200,
      powerConsumption: 220,
    },
    health: 'OK',
    node: {
      lng: 105.92285708151462,
      lat: 20.61295974014286,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Tank-GES-2000',
    fromNodeId: new ObjectId('5b4efbe26339ec2a4228adfc'),
    useStartDate: '2018-07-18T09:27:12.316Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf81'),
    exportId: new ObjectId('5b4eacd20008dc04d307179e'),
    description: '',
  },

  /* 27 createdAt:7/18/2018, lat: 4:26:30 PM*/
  {
    id: new ObjectId('5b4f07c66339ec2a4228ae1c'),
    name: 'Jet 40',
    type: 'Pump',
    meta: {
      diameter: 1000,
      capacity: 20000,
      powerConsumption: 220,
    },
    health: 'OK',
    node: {
      lng: 105.91634720696652,
      lat: 20.642455111065388,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'Pump-Jet-40',
    fromNodeId: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    useStartDate: '2018-07-18T09:25:12.748Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7e'),
    exportId: new ObjectId('5b4eacd20008dc04d307179b'),
    description: '',
  },

  /* 28 createdAt:7/18/2018, lat: 4:25:09 PM*/
  {
    id: new ObjectId('5b4f07756339ec2a4228ae1b'),
    name: 'Jet 60',
    type: 'Pump',
    meta: {
      diameter: 1000,
      capacity: 20000,
      powerConsumption: 220,
    },
    health: 'OK',
    node: {
      lng: 105.93763192071538,
      lat: 20.646514414814067,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'Pump-Jet-60',
    fromNodeId: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    useStartDate: '2018-07-18T09:24:32.432Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7f'),
    exportId: new ObjectId('5b4eacd20008dc04d307179c'),
    description: '',
  },

  /* 29 createdAt:7/18/2018, lat: 4:24:22 PM*/
  {
    id: new ObjectId('5b4f07466339ec2a4228ae1a'),
    name: 'FSF DN10',
    type: 'PressureReducing',
    meta: {
      diameter: 220,
    },
    health: 'OK',
    node: {
      lng: 105.91401911454602,
      lat: 20.66925410146523,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'PressureReducing-FSF-DN10',
    fromNodeId: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    useStartDate: '2018-07-18T09:24:09.819Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf78'),
    exportId: new ObjectId('5b4eacd10008dc04d3071795'),
    description: '',
  },

  /* 30 createdAt:7/18/2018, lat: 4:23:38 PM*/
  {
    id: new ObjectId('5b4f071a6339ec2a4228ae19'),
    name: 'FSF DN30',
    type: 'PressureReducing',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.9340354071478,
      lat: 20.677068489860723,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'PressureReducing-FSF-DN30',
    fromNodeId: new ObjectId('5b4efc586339ec2a4228ae00'),
    useStartDate: '2018-07-18T09:23:16.265Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf79'),
    exportId: new ObjectId('5b4eacd10008dc04d3071796'),
    description: '',
  },

  /* 31 createdAt:7/18/2018, lat: 4:23:13 PM*/
  {
    id: new ObjectId('5b4f07016339ec2a4228ae18'),
    name: 'FSF DN40',
    type: 'PressureReducing',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.94328737931653,
      lat: 20.6179298567822,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'PressureReducing-FSF-DN40',
    fromNodeId: new ObjectId('5b4efbeb6339ec2a4228adfd'),
    useStartDate: '2018-07-18T09:23:00.148Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7a'),
    exportId: new ObjectId('5b4eacd10008dc04d3071797'),
    description: '',
  },

  /* 32 createdAt:7/18/2018, lat: 4:22:55 PM*/
  {
    id: new ObjectId('5b4f06ef6339ec2a4228ae17'),
    name: 'FSF DN60',
    type: 'PressureReducing',
    meta: {
      diameter: 200,
    },
    health: 'OK',
    node: {
      lng: 105.92285708151462,
      lat: 20.61295974014286,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'PressureReducing-FSF-DN60',
    fromNodeId: new ObjectId('5b4efbe26339ec2a4228adfc'),
    useStartDate: '2018-07-18T09:22:33.553Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf7b'),
    exportId: new ObjectId('5b4eacd20008dc04d3071798'),
    description: '',
  },

  /* 33 createdAt:7/18/2018, lat: 4:22:15 PM*/
  {
    id: new ObjectId('5b4f06c76339ec2a4228ae16'),
    name: 'SF DN10',
    type: 'Filter',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.9367847442627,
      lat: 20.644471138712216,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'Filter-SF-DN10',
    fromNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    useStartDate: '2018-07-18T09:22:01.591Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf74'),
    exportId: new ObjectId('5b4eacd10008dc04d3071791'),
    description: '',
  },

  /* 34 createdAt:7/18/2018, lat: 4:21:55 PM*/
  {
    id: new ObjectId('5b4f06b36339ec2a4228ae15'),
    name: 'SF DN30',
    type: 'Filter',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.9150155343018,
      lat: 20.640289635315934,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Filter-SF-DN30',
    fromNodeId: new ObjectId('5b4ef6156339ec2a4228ade6'),
    useStartDate: '2018-07-18T09:21:37.835Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf75'),
    exportId: new ObjectId('5b4eacd10008dc04d3071792'),
    description: '',
  },

  /* 35 createdAt:7/18/2018, lat: 4:21:31 PM*/
  {
    id: new ObjectId('5b4f069b6339ec2a4228ae14'),
    name: 'SF DN40',
    type: 'Filter',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91367511792669,
      lat: 20.64455607605854,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'Filter-SF-DN40',
    fromNodeId: new ObjectId('5b4ef6756339ec2a4228adeb'),
    useStartDate: '2018-07-18T09:21:10.342Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf76'),
    exportId: new ObjectId('5b4eacd10008dc04d3071793'),
    description: '',
  },

  /* 36 createdAt:7/18/2018, lat: 4:20:31 PM*/
  {
    id: new ObjectId('5b4f065f6339ec2a4228ae13'),
    name: 'SF DN60',
    type: 'Filter',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91607615887199,
      lat: 20.660349583945873,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'Filter-SF-DN60',
    fromNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    useStartDate: '2018-07-18T09:20:04.860Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf77'),
    exportId: new ObjectId('5b4eacd10008dc04d3071794'),
    description: '',
  },

  /* 37 createdAt:7/18/2018, lat: 4:15:46 PM*/
  {
    id: new ObjectId('5b4f05426339ec2a4228ae12'),
    name: 'YSI EXO2',
    type: 'QualityLogger',
    health: 'OK',
    optionKey: 'QL00002',
    node: {
      lng: 105.9367847442627,
      lat: 20.644471138712216,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'QualityLogger-YSI-EXO2',
    fromNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    useStartDate: '2018-07-18T09:15:15.485Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6e'),
    exportId: new ObjectId('5b4eacd10008dc04d307178b'),
    description: '',
  },

  /* 38 createdAt:7/18/2018, lat: 4:15:07 PM*/
  {
    id: new ObjectId('5b4f051b6339ec2a4228ae11'),
    name: 'AQUA TROLL 600',
    type: 'QualityLogger',
    health: 'OK',
    optionKey: 'QL00001',
    node: {
      lng: 105.93449910058598,
      lat: 20.64751838764515,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'QualityLogger-AQUA-TROLL-600',
    fromNodeId: new ObjectId('5b4ef62b6339ec2a4228ade7'),
    useStartDate: '2018-07-18T09:11:48.473Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6f'),
    exportId: new ObjectId('5b4eacd10008dc04d307178c'),
    description: '',
  },

  /* 39 createdAt:7/18/2018, lat: 3:52:34 PM*/
  {
    id: new ObjectId('5b4effd26339ec2a4228ae10'),
    name: 'EMS GTI 5',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00012',
    node: {
      lng: 105.91374560853956,
      lat: 20.660308688342628,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'FlowLogger-EMS-GTI-5',
    fromNodeId: new ObjectId('5b4ef6806339ec2a4228adec'),
    useStartDate: '2018-07-18T08:52:14.668Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6b'),
    exportId: new ObjectId('5b4eacd10008dc04d3071788'),
    description: '',
  },

  /* 40 createdAt:7/18/2018, lat: 3:51:58 PM*/
  {
    id: new ObjectId('5b4effae6339ec2a4228ae0f'),
    name: 'EMS GTI 4',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00011',
    node: {
      lng: 105.91367511792669,
      lat: 20.64455607605854,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'FlowLogger-EMS-GTI-4',
    fromNodeId: new ObjectId('5b4ef6756339ec2a4228adeb'),
    useStartDate: '2018-07-18T08:51:38.057Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6a'),
    exportId: new ObjectId('5b4eacd10008dc04d3071787'),
    description: '',
  },

  /* 41 createdAt:7/18/2018, lat: 3:51:10 PM*/
  {
    id: new ObjectId('5b4eff7e6339ec2a4228ae0e'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00010',
    node: {
      lng: 105.91607615887199,
      lat: 20.660349583945873,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    useStartDate: '2018-07-18T08:50:43.448Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
  },

  /* 42 createdAt:7/18/2018, lat: 3:50:39 PM*/
  {
    id: new ObjectId('5b4eff5f6339ec2a4228ae0d'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00009',
    node: {
      lng: 105.91636226809533,
      lat: 20.6446844704485,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef6926339ec2a4228aded'),
    useStartDate: '2018-07-18T08:49:30.145Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
  },

  /* 43 createdAt:7/18/2018, lat: 3:48:54 PM*/
  {
    id: new ObjectId('5b4efef66339ec2a4228ae0c'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00008',
    node: {
      lng: 105.93278248681645,
      lat: 20.659967099921115,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef6386339ec2a4228ade8'),
    useStartDate: '2018-07-18T08:48:28.257Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 44 createdAt:7/18/2018, lat: 3:48:25 PM*/
  {
    id: new ObjectId('5b4efed96339ec2a4228ae0b'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00007',
    node: {
      lng: 105.93449910058598,
      lat: 20.64751838764515,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef62b6339ec2a4228ade7'),
    useStartDate: '2018-07-18T08:47:49.014Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 45 createdAt:7/18/2018, lat: 3:47:44 PM*/
  {
    id: new ObjectId('5b4efeb06339ec2a4228ae0a'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00006',
    node: {
      lng: 105.93520565445192,
      lat: 20.660126868759875,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef6696339ec2a4228adea'),
    useStartDate: '2018-07-18T08:47:20.908Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
  },

  /* 46 createdAt:7/18/2018, lat: 3:47:13 PM*/
  {
    id: new ObjectId('5b4efe916339ec2a4228ae09'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00005',
    node: {
      lng: 105.93696280977247,
      lat: 20.64807083702256,
    },
    dmaId: new ObjectId('5b448d3a21c0782a6f4a7554'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef6596339ec2a4228ade9'),
    useStartDate: '2018-07-18T08:46:08.413Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
  },

  /* 47 createdAt:7/18/2018, lat: 3:45:30 PM*/
  {
    id: new ObjectId('5b4efe2a6339ec2a4228ae08'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00004',
    node: {
      lng: 105.9367847442627,
      lat: 20.644471138712216,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    useStartDate: '2018-07-18T08:45:11.841Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 48 createdAt:7/18/2018, lat: 3:45:07 PM*/
  {
    id: new ObjectId('5b4efe136339ec2a4228ae07'),
    name: 'ABB LOG B',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00003',
    node: {
      lng: 105.9150155343018,
      lat: 20.640289635315934,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'FlowLogger-ABB-LOG-B',
    fromNodeId: new ObjectId('5b4ef6156339ec2a4228ade6'),
    useStartDate: '2018-07-18T08:44:44.435Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6d'),
    exportId: new ObjectId('5b4eacd10008dc04d307178a'),
    description: '',
  },

  /* 49 createdAt:7/18/2018, lat: 3:43:31 PM*/
  {
    id: new ObjectId('5b4efdb36339ec2a4228ae06'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00002',
    node: {
      lng: 105.91634720696652,
      lat: 20.642455111065388,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    useStartDate: '2018-07-18T08:43:14.830Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
    meta: {
      isMiddle: true,
      designFlow: 50000,
      designPressure: 3.5,
    },
  },

  /* 50 createdAt:7/18/2018, lat: 3:43:10 PM*/
  {
    id: new ObjectId('5b4efd9e6339ec2a4228ae05'),
    name: 'ABB LOG A',
    type: 'FlowLogger',
    health: 'OK',
    optionKey: 'LG00001',
    node: {
      lng: 105.93763192071538,
      lat: 20.646514414814067,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'FlowLogger-ABB-LOG-A',
    fromNodeId: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    useStartDate: '2018-07-18T08:41:58.781Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf6c'),
    exportId: new ObjectId('5b4eacd10008dc04d3071789'),
    description: '',
  },

  /* 51 createdAt:7/18/2018, lat: 3:40:41 PM*/
  {
    id: new ObjectId('5b4efd096339ec2a4228ae04'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91607615887199,
      lat: 20.660349583945873,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    toNodeId: new ObjectId('5b4efc5e6339ec2a4228ae01'),
    useStartDate: '2018-07-18T08:40:26.506Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 1013,
    polyline: [
      {
        lat: 20.660349583945873,
        lng: 105.91607615887199,
      },
      {
        lat: 20.662858267824884,
        lng: 105.91587384118657,
      },
      {
        lat: 20.665026607647516,
        lng: 105.91518719567875,
      },
      {
        lat: 20.667435837817308,
        lng: 105.9146722115479,
      },
      {
        lat: 20.66925410146523,
        lng: 105.91401911454602,
      },
    ],
  },

  /* 52 createdAt:7/18/2018, lat: 3:38:52 PM*/
  {
    id: new ObjectId('5b4efc9c6339ec2a4228ae02'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.93520565445192,
      lat: 20.660126868759875,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef6696339ec2a4228adea'),
    toNodeId: new ObjectId('5b4efc586339ec2a4228ae00'),
    useStartDate: '2018-07-18T08:38:22.842Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 1887,
    polyline: [
      {
        lat: 20.660126868759875,
        lng: 105.93520565445192,
      },
      {
        lat: 20.663110204637725,
        lng: 105.93534735208232,
      },
      {
        lat: 20.666483158727985,
        lng: 105.93526152139384,
      },
      {
        lat: 20.670739398666345,
        lng: 105.93500402932841,
      },
      {
        lat: 20.672666713363856,
        lng: 105.93491819863993,
      },
      {
        lat: 20.674674306828372,
        lng: 105.93457487588603,
      },
      {
        lat: 20.677068489860723,
        lng: 105.9340354071478,
      },
    ],
  },

  /* 53 createdAt:7/18/2018, lat: 3:37:00 PM*/
  {
    id: new ObjectId('5b4efc2c6339ec2a4228adff'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.9367847442627,
      lat: 20.644471138712216,
    },
    dmaId: new ObjectId('5b448e0d21c0782a6f4a7556'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    toNodeId: new ObjectId('5b4efbeb6339ec2a4228adfd'),
    useStartDate: '2018-07-18T08:36:37.518Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 3025,
    polyline: [
      {
        lat: 20.644471138712216,
        lng: 105.9367847442627,
      },
      {
        lat: 20.642268864491506,
        lng: 105.9375367231886,
      },
      {
        lat: 20.639778913758107,
        lng: 105.93796587663098,
      },
      {
        lat: 20.636164396619595,
        lng: 105.93839503007337,
      },
      {
        lat: 20.632228491405602,
        lng: 105.93959665971204,
      },
      {
        lat: 20.62805150105972,
        lng: 105.94062662797376,
      },
      {
        lat: 20.623713735909227,
        lng: 105.94234324174329,
      },
      {
        lat: 20.620902155442135,
        lng: 105.94277239518567,
      },
      {
        lat: 20.6179298567822,
        lng: 105.94328737931653,
      },
    ],
  },

  /* 54 createdAt:7/18/2018, lat: 3:36:31 PM*/
  {
    id: new ObjectId('5b4efc0f6339ec2a4228adfe'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.9150155343018,
      lat: 20.640289635315934,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef6156339ec2a4228ade6'),
    toNodeId: new ObjectId('5b4efbe26339ec2a4228adfc'),
    useStartDate: '2018-07-18T08:36:02.134Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 3142,
    polyline: [
      {
        lat: 20.640289635315934,
        lng: 105.9150155343018,
      },
      {
        lat: 20.63718754130866,
        lng: 105.916202519703,
      },
      {
        lat: 20.634295885213252,
        lng: 105.9169749958993,
      },
      {
        lat: 20.630038624842637,
        lng: 105.91834828691492,
      },
      {
        lat: 20.625299270389732,
        lng: 105.91937825517664,
      },
      {
        lat: 20.620399104711026,
        lng: 105.9210090382577,
      },
      {
        lat: 20.6175071296564,
        lng: 105.9213523610116,
      },
      {
        lat: 20.614374094706378,
        lng: 105.92238232927332,
      },
      {
        lat: 20.61295974014286,
        lng: 105.92285708151462,
      },
    ],
  },

  /* 55 createdAt:7/18/2018, lat: 3:25:27 PM*/
  {
    id: new ObjectId('5b4ef9776339ec2a4228adfb'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91607615887199,
      lat: 20.660349583945873,
    },
    dmaId: new ObjectId('5b448e8621c0782a6f4a7557'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    toNodeId: new ObjectId('5b4ef6806339ec2a4228adec'),
    useStartDate: '2018-07-18T08:25:10.868Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 243,
    polyline: [
      {
        lat: 20.660349583945873,
        lng: 105.91607615887199,
      },
      {
        lat: 20.660308688342628,
        lng: 105.91374560853956,
      },
    ],
  },

  /* 56 createdAt:7/18/2018, lat: 3:20:02 PM*/
  {
    id: new ObjectId('5b4ef8326339ec2a4228adf8'),
    name: 'Ống Gang DN-100',
    type: 'Pipe',
    meta: {
      diameter: 100,
    },
    health: 'OK',
    node: {
      lng: 105.91636226809533,
      lat: 20.6446844704485,
    },
    dmaId: new ObjectId('5b448ed721c0782a6f4a7558'),
    detailTypeId: 'Pipe-Ong-Gang-DN-100',
    fromNodeId: new ObjectId('5b4ef6926339ec2a4228aded'),
    toNodeId: new ObjectId('5b4ef6756339ec2a4228adeb'),
    useStartDate: '2018-07-18T08:19:46.768Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf66'),
    exportId: new ObjectId('5b4eacd10008dc04d3071783'),
    description: '',
    length: 280,
    polyline: [
      {
        lat: 20.6446844704485,
        lng: 105.91636226809533,
      },
      {
        lat: 20.64455607605854,
        lng: 105.91367511792669,
      },
    ],
  },

  /* 57 createdAt:7/18/2018, lat: 3:19:42 PM*/
  {
    id: new ObjectId('5b4ef81e6339ec2a4228adf7'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.91636226809533,
      lat: 20.6446844704485,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef6926339ec2a4228aded'),
    toNodeId: new ObjectId('5b4ef69a6339ec2a4228adee'),
    useStartDate: '2018-07-18T08:19:19.502Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 1745,
    polyline: [
      {
        lat: 20.6446844704485,
        lng: 105.91636226809533,
      },
      {
        lat: 20.64968251590653,
        lng: 105.91625071244641,
      },
      {
        lat: 20.652493564551012,
        lng: 105.91616488175794,
      },
      {
        lat: 20.655384874639516,
        lng: 105.91659403520032,
      },
      {
        lat: 20.65731238414244,
        lng: 105.91659403520032,
      },
      {
        lat: 20.659320180545112,
        lng: 105.91650820451184,
      },
      {
        lat: 20.660349583945873,
        lng: 105.91607615887199,
      },
    ],
  },

  /* 58 createdAt:7/18/2018, lat: 3:19:14 PM*/
  {
    id: new ObjectId('5b4ef8026339ec2a4228adf6'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.91634720696652,
      lat: 20.642455111065388,
    },
    dmaId: new ObjectId('5b447ea721c0782a6f4a7551'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    toNodeId: new ObjectId('5b4ef6926339ec2a4228aded'),
    useStartDate: '2018-07-18T08:18:50.919Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 247,
    polyline: [
      {
        lat: 20.642455111065388,
        lng: 105.91634720696652,
      },
      {
        lat: 20.6446844704485,
        lng: 105.91636226809533,
      },
    ],
  },

  /* 59 createdAt:7/18/2018, lat: 3:18:18 PM*/
  {
    id: new ObjectId('5b4ef7ca6339ec2a4228adf5'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.91634720696652,
      lat: 20.642455111065388,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    toNodeId: new ObjectId('5b4ef6156339ec2a4228ade6'),
    useStartDate: '2018-07-18T08:17:58.926Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 277,
    polyline: [
      {
        lat: 20.642455111065388,
        lng: 105.91634720696652,
      },
      {
        lat: 20.640289635315934,
        lng: 105.9150155343018,
      },
    ],
  },

  /* 60 createdAt:7/18/2018, lat: 3:17:49 PM*/
  {
    id: new ObjectId('5b4ef7ad6339ec2a4228adf4'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.93763192071538,
      lat: 20.646514414814067,
    },
    dmaId: new ObjectId('5b448dc521c0782a6f4a7555'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    toNodeId: new ObjectId('5b4ef60c6339ec2a4228ade5'),
    useStartDate: '2018-07-18T08:17:29.138Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 243,
    polyline: [
      {
        lat: 20.646514414814067,
        lng: 105.93763192071538,
      },
      {
        lat: 20.644471138712216,
        lng: 105.9367847442627,
      },
    ],
  },

  /* 61 createdAt:7/18/2018, lat: 3:17:17 PM*/
  {
    id: new ObjectId('5b4ef78d6339ec2a4228adf3'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.93520565445192,
      lat: 20.660126868759875,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4ef6696339ec2a4228adea'),
    toNodeId: new ObjectId('5b4ef6386339ec2a4228ade8'),
    useStartDate: '2018-07-18T08:17:01.750Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 253,
    polyline: [
      {
        lat: 20.660126868759875,
        lng: 105.93520565445192,
      },
      {
        lat: 20.659967099921115,
        lng: 105.93278248681645,
      },
    ],
  },

  /* 62 createdAt:7/18/2018, lat: 3:16:54 PM*/
  {
    id: new ObjectId('5b4ef7766339ec2a4228adf2'),
    name: 'Ống Gang DN-300',
    type: 'Pipe',
    meta: {
      diameter: 300,
    },
    health: 'OK',
    node: {
      lng: 105.93696280977247,
      lat: 20.64807083702256,
    },
    dmaId: new ObjectId('5b448cc221c0782a6f4a7553'),
    detailTypeId: 'Pipe-Ong-Gang-DN-300',
    fromNodeId: new ObjectId('5b4ef6596339ec2a4228ade9'),
    toNodeId: new ObjectId('5b4ef62b6339ec2a4228ade7'),
    useStartDate: '2018-07-18T08:16:38.670Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf67'),
    exportId: new ObjectId('5b4eacd10008dc04d3071784'),
    description: '',
    length: 264,
    polyline: [
      {
        lat: 20.64807083702256,
        lng: 105.93696280977247,
      },
      {
        lat: 20.64751838764515,
        lng: 105.93449910058598,
      },
    ],
  },

  /* 63 createdAt:7/18/2018, lat: 3:16:17 PM*/
  {
    id: new ObjectId('5b4ef7516339ec2a4228adf1'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.93696280977247,
      lat: 20.64807083702256,
    },
    dmaId: new ObjectId('5b447dee21c0782a6f4a7550'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef6596339ec2a4228ade9'),
    toNodeId: new ObjectId('5b4ef6696339ec2a4228adea'),
    useStartDate: '2018-07-18T08:15:50.368Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 1352,
    polyline: [
      {
        lat: 20.64807083702256,
        lng: 105.93696280977247,
      },
      {
        lat: 20.651237787749206,
        lng: 105.93637466037057,
      },
      {
        lat: 20.653888179326803,
        lng: 105.935730930207,
      },
      {
        lat: 20.656779462886366,
        lng: 105.93521594607614,
      },
      {
        lat: 20.65886757791602,
        lng: 105.93521594607614,
      },
      {
        lat: 20.660126868759875,
        lng: 105.93520565445192,
      },
    ],
  },

  /* 64 createdAt:7/18/2018, lat: 3:15:44 PM*/
  {
    id: new ObjectId('5b4ef7306339ec2a4228adf0'),
    name: 'Ống Gang DN-400',
    type: 'Pipe',
    meta: {
      diameter: 400,
    },
    health: 'OK',
    node: {
      lng: 105.93763192071538,
      lat: 20.646514414814067,
    },
    dmaId: new ObjectId('5b447dee21c0782a6f4a7550'),
    detailTypeId: 'Pipe-Ong-Gang-DN-400',
    fromNodeId: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    toNodeId: new ObjectId('5b4ef6596339ec2a4228ade9'),
    useStartDate: '2018-07-18T08:15:21.065Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf68'),
    exportId: new ObjectId('5b4eacd10008dc04d3071785'),
    description: '',
    length: 186,
    polyline: [
      {
        lat: 20.646514414814067,
        lng: 105.93763192071538,
      },
      {
        lat: 20.64807083702256,
        lng: 105.93696280977247,
      },
    ],
  },

  /* 65 createdAt:7/18/2018, lat: 3:15:05 PM*/
  {
    id: new ObjectId('5b4ef7096339ec2a4228adef'),
    name: 'Ống Gang DN-600',
    type: 'Pipe',
    meta: {
      diameter: 600,
    },
    health: 'OK',
    node: {
      lng: 105.93763192071538,
      lat: 20.646514414814067,
    },
    dmaId: new ObjectId('5b4481d221c0782a6f4a7552'),
    detailTypeId: 'Pipe-Ong-Gang-DN-600',
    fromNodeId: new ObjectId('5b4ef5c56339ec2a4228ade3'),
    toNodeId: new ObjectId('5b4ef5e46339ec2a4228ade4'),
    useStartDate: '2018-07-18T08:14:09.421Z',
    stockId: new ObjectId('5b4eacc952ea8304d082bf69'),
    exportId: new ObjectId('5b4eacd10008dc04d3071786'),
    description: '',
    length: 2278,
    polyline: [
      {
        lat: 20.646514414814067,
        lng: 105.93763192071538,
      },
      {
        lat: 20.646173329690733,
        lng: 105.9363190796089,
      },
      {
        lat: 20.64557094145902,
        lng: 105.93391582033155,
      },
      {
        lat: 20.64508902915553,
        lng: 105.93168422243116,
      },
      {
        lat: 20.644848072431078,
        lng: 105.93013927003858,
      },
      {
        lat: 20.644366157836778,
        lng: 105.92833682558057,
      },
      {
        lat: 20.64412519996696,
        lng: 105.92704936525342,
      },
      {
        lat: 20.643844081969622,
        lng: 105.92550441286085,
      },
      {
        lat: 20.64324168451125,
        lng: 105.92228576204297,
      },
      {
        lat: 20.64263928466678,
        lng: 105.91915294191358,
      },
      {
        lat: 20.64219255469291,
        lng: 105.91801696015193,
      },
      {
        lat: 20.642455111065388,
        lng: 105.91634720696652,
      },
    ],
  },
];
module.exports = {
  init: async app => {
    let model = app.models.MaterialUse;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms MaterialUse error', err) : console.log('init MaterialUse OK!')), // eslint-disable-line no-console
    );
  },
};
