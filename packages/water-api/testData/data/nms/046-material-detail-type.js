const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const data = [
  /* 1 */
  {
    id: 'Valve-VABB-D600',
    type: 'Valve',
    name: 'VABB D600',
    slug: 'babb-d600',
    meta: {
      diameter: 600,
    },
    description: '',
  },

  /* 2 */
  {
    id: 'Valve-VABB-D400',
    type: 'Valve',
    name: 'VABB D400',
    slug: 'babb-d400',
    meta: {
      diameter: 400,
    },
    description: '',
  },

  /* 3 */
  {
    id: 'Valve-VABB-D300',
    type: 'Valve',
    name: 'VABB D300',
    slug: 'babb-d300',
    meta: {
      diameter: 300,
    },
    description: '',
  },

  /* 4 */
  {
    id: 'Valve-VABB-D100',
    type: 'Valve',
    name: 'VABB D100',
    slug: 'babb-d100',
    meta: {
      diameter: 100,
    },
    description: '',
  },

  /* 5 */
  {
    id: 'Tank-GES-2000',
    type: 'Tank',
    name: 'GES 2000',
    slug: 'ges-2000',
    meta: {
      volume: 2000,
    },
    description: '',
  },

  /* 6 */
  {
    id: 'Tank-GES-1000',
    type: 'Tank',
    name: 'GES 1000',
    slug: 'ges-1000',
    meta: {
      volume: 1000,
    },
    description: '',
  },

  /* 7 */
  {
    id: 'QualityLogger-YSI-EXO2',
    type: 'QualityLogger',
    name: 'YSI EXO2',
    slug: 'ysi-exo2',
    meta: {
      carrier: 'YSI',
      communication: '3G',
    },
    description: '',
  },

  /* 8 */
  {
    id: 'QualityLogger-AQUA-TROLL-600',
    type: 'QualityLogger',
    name: 'AQUA TROLL 600',
    slug: 'aqua-troll-600',
    meta: {
      carrier: 'IN-SITU',
      communication: '3G',
    },
    description: '',
  },

  /* 9 */
  {
    id: 'Pump-Jet-60',
    type: 'Pump',
    name: 'Jet 60',
    slug: 'jet-60',
    meta: {
      diameter: 600,
    },
    description: '',
  },

  /* 10 */
  {
    id: 'Pump-Jet-40',
    type: 'Pump',
    name: 'Jet 40',
    slug: 'jet-40',
    meta: {
      diameter: 400,
    },
    description: '',
  },

  /* 11 */
  {
    id: 'Pump-Jet-30',
    type: 'Pump',
    name: 'Jet 30',
    slug: 'jet-30',
    meta: {
      diameter: 300,
    },
    description: '',
  },

  /* 12 */
  {
    id: 'Pump-Jet-10',
    type: 'Pump',
    name: 'Jet 10',
    slug: 'jet-10',
    meta: {
      diameter: 100,
    },
    description: '',
  },

  /* 13 */
  {
    id: 'PressureReducing-FSF-DN60',
    type: 'PressureReducing',
    name: 'FSF DN60',
    slug: 'fsf-dn60',
    meta: {
      diameter: 600,
    },
    description: '',
  },

  /* 14 */
  {
    id: 'PressureReducing-FSF-DN40',
    type: 'PressureReducing',
    name: 'FSF DN40',
    slug: 'fsf-dn40',
    meta: {
      diameter: 400,
    },
    description: '',
  },

  /* 15 */
  {
    id: 'PressureReducing-FSF-DN30',
    type: 'PressureReducing',
    name: 'FSF DN30',
    slug: 'fsf-dn30',
    meta: {
      diameter: 300,
    },
    description: '',
  },

  /* 16 */
  {
    id: 'PressureReducing-FSF-DN10',
    type: 'PressureReducing',
    name: 'FSF DN10',
    slug: 'fsf-dn10',
    meta: {
      diameter: 100,
    },
    description: '',
  },

  /* 17 */
  {
    id: 'Pipe-Ong-Gang-DN-600',
    type: 'Pipe',
    name: 'Ống Gang DN-600',
    slug: 'ong-gang-dn-600',
    meta: {
      diameter: 600,
      externalDiameter: 635,
    },
    description: '',
  },

  /* 18 */
  {
    id: 'Pipe-Ong-Gang-DN-400',
    type: 'Pipe',
    name: 'Ống Gang DN-400',
    slug: 'ong-gang-dn-400',
    meta: {
      diameter: 400,
      externalDiameter: 429,
    },
    description: '',
  },

  /* 19 */
  {
    id: 'Pipe-Ong-Gang-DN-300',
    type: 'Pipe',
    name: 'Ống Gang DN-300',
    slug: 'ong-gang-dn-300',
    meta: {
      diameter: 300,
      externalDiameter: 326,
    },
    description: '',
  },

  /* 20 */
  {
    id: 'Pipe-Ong-Gang-DN-100',
    type: 'Pipe',
    name: 'Ống Gang DN-100',
    slug: 'ong-gang-dn-100',
    meta: {
      diameter: 100,
      externalDiameter: 118,
    },
    description: '',
  },

  /* 21 */
  {
    id: 'Other-Power-Generator-10KVA',
    type: 'Other',
    name: 'Power Generator 10KVA',
    slug: 'power-generator-10kva',
    meta: {},
    description: '',
  },

  /* 22 */
  {
    id: 'Meter-ABB-DN60',
    type: 'Meter',
    name: 'ABB DN60',
    slug: 'abb-dn60',
    meta: {
      diameter: 600,
    },
    description: '',
  },

  /* 23 */
  {
    id: 'Meter-ABB-DN40',
    type: 'Meter',
    name: 'ABB DN40',
    slug: 'abb-dn40',
    meta: {
      diameter: 400,
    },
    description: '',
  },

  /* 24 */
  {
    id: 'Meter-ABB-DN30',
    type: 'Meter',
    name: 'ABB DN30',
    slug: 'abb-dn30',
    meta: {
      diameter: 300,
    },
    description: '',
  },

  /* 25 */
  {
    id: 'Meter-ABB-DN10',
    type: 'Meter',
    name: 'ABB DN10',
    slug: 'abb-dn10',
    meta: {
      diameter: 100,
    },
    description: '',
  },

  /* 26 */
  {
    id: 'FlowLogger-loai-data-A',
    type: 'FlowLogger',
    name: 'loai data A',
    slug: 'loai-data-A',
    meta: {
      communication: '2G',
    },
    description: '',
  },

  /* 27 */
  {
    id: 'FlowLogger-EMS-GTI-5',
    type: 'FlowLogger',
    name: 'EMS GTI 5',
    slug: 'ems-gti-5',
    meta: {
      carrier: 'EMS',
      communication: '4G',
    },
    description: '',
  },

  /* 28 */
  {
    id: 'FlowLogger-EMS-GTI-4',
    type: 'FlowLogger',
    name: 'EMS GTI 4',
    slug: 'ems-gti-4',
    meta: {
      carrier: 'EMS',
      communication: '3G',
    },
    description: '',
  },

  /* 29 */
  {
    id: 'FlowLogger-ABB-LOG-B',
    type: 'FlowLogger',
    name: 'ABB LOG B',
    slug: 'abb-log-b',
    meta: {
      carrier: 'ABB',
      communication: '3G',
    },
    description: '',
  },

  /* 30 */
  {
    id: 'FlowLogger-ABB-LOG-A',
    type: 'FlowLogger',
    name: 'ABB LOG A',
    slug: 'abb-log-a',
    meta: {
      carrier: 'ABB',
      communication: '3G',
    },
    description: '',
  },

  /* 31 */
  {
    id: 'Filter-SF-DN60',
    type: 'Filter',
    name: 'SF DN60',
    slug: 'sf-dn60',
    meta: {
      diameter: 600,
    },
    description: '',
  },

  /* 32 */
  {
    id: 'Filter-SF-DN40',
    type: 'Filter',
    name: 'SF DN40',
    slug: 'sf-dn40',
    meta: {
      diameter: 400,
    },
    description: '',
  },

  /* 33 */
  {
    id: 'Filter-SF-DN30',
    type: 'Filter',
    name: 'SF DN30',
    slug: 'sf-dn30',
    meta: {
      diameter: 300,
    },
    description: '',
  },

  /* 34 */
  {
    id: 'Filter-SF-DN10',
    type: 'Filter',
    name: 'SF DN10',
    slug: 'sf-dn10',
    meta: {
      diameter: 100,
    },
    description: '',
  },

  /* 35 */
  {
    id: 'ElectricLogger-loai-cb-dn-2',
    type: 'ElectricLogger',
    name: 'loai cb dn 2',
    slug: 'loai-cb-dn-2',
    description: '',
  },

  /* 36 */
  {
    id: 'ElectricLogger-loai-cb-dn-1',
    type: 'ElectricLogger',
    name: 'loai cb DN 1',
    slug: 'loai-cb-DN-1',
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.MaterialDetailType;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err ? console.error('init nms MaterialDetailType error', err) : console.log('init MaterialDetailType OK!'), // eslint-disable-line no-console
    );
  },
};
