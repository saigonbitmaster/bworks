'use strict';
const { mapSeries } = require('async');
const slug = require('slug');
const dataUtil = require('ra-loopback3/server/utils/data');

/* eslint-disable */
let data = [
  // Pipe
  { type: 'Pipe', name: 'Ống Gang DN-100', slug: 'ong-gang-dn-100', meta: { diameter: 100, externalDiameter: 118 } },
  { type: 'Pipe', name: 'Ống Gang DN-300', slug: 'ong-gang-dn-300', meta: { diameter: 300, externalDiameter: 326 } },
  { type: 'Pipe', name: 'Ống Gang DN-400', slug: 'ong-gang-dn-400', meta: { diameter: 400, externalDiameter: 429 } },
  { type: 'Pipe', name: 'Ống Gang DN-600', slug: 'ong-gang-dn-600', meta: { diameter: 600, externalDiameter: 635 } },
  // FlowLogger
  { type: 'FlowLogger', name: 'EMS GTI 4', slug: 'ems-gti-4', meta: { carrier: 'EMS', communication: '3G' } },
  { type: 'FlowLogger', name: 'EMS GTI 5', slug: 'ems-gti-5', meta: { carrier: 'EMS', communication: '4G' } },
  { type: 'FlowLogger', name: 'ABB LOG A', slug: 'abb-log-a', meta: { carrier: 'ABB', communication: '3G' } },
  { type: 'FlowLogger', name: 'ABB LOG B', slug: 'abb-log-b', meta: { carrier: 'ABB', communication: '3G' } },
  // QualityLogger
  { type: 'QualityLogger', name: 'YSI EXO2', slug: 'ysi-exo2', meta: { carrier: 'YSI', communication: '3G' } },
  { type: 'QualityLogger', name: 'AQUA TROLL 600', slug: 'aqua-troll-600', meta: { carrier: 'IN-SITU', communication: '3G' } },
  // Meter
  {type: 'Meter', name: 'ABB DN10', slug: 'abb-dn10', meta: { diameter: 100 } },
  { type: 'Meter', name: 'ABB DN30', slug: 'abb-dn30', meta: { diameter: 300 } },
  { type: 'Meter', name: 'ABB DN40', slug: 'abb-dn40', meta: { diameter: 400 } },
  { type: 'Meter', name: 'ABB DN60', slug: 'abb-dn60', meta: { diameter: 600 } },
  // Filter
  { type: 'Filter', name: 'SF DN10', slug: 'sf-dn10', meta: { diameter: 100 } },
  { type: 'Filter', name: 'SF DN30', slug: 'sf-dn30', meta: { diameter: 300 } },
  { type: 'Filter', name: 'SF DN40', slug: 'sf-dn40', meta: { diameter: 400 } },
  { type: 'Filter', name: 'SF DN60', slug: 'sf-dn60', meta: { diameter: 600 } },
  // PressureReducing
  { type: 'PressureReducing', name: 'FSF DN10', slug: 'fsf-dn10', meta: { diameter: 100 } },
  { type: 'PressureReducing', name: 'FSF DN30', slug: 'fsf-dn30', meta: { diameter: 300 } },
  { type: 'PressureReducing', name: 'FSF DN40', slug: 'fsf-dn40', meta: { diameter: 400 } },
  { type: 'PressureReducing', name: 'FSF DN60', slug: 'fsf-dn60', meta: { diameter: 600 } },
  // Pump 
  { type: 'Pump', name: 'Jet 10', slug: 'jet-10', meta: { diameter: 100 } },
  { type: 'Pump', name: 'Jet 30', slug: 'jet-30', meta: { diameter: 300 } },
  { type: 'Pump', name: 'Jet 40', slug: 'jet-40', meta: { diameter: 400 } },
  { type: 'Pump', name: 'Jet 60', slug: 'jet-60', meta: { diameter: 600 } },
  // Tank
  { type: 'Tank', name: 'GES 1000', slug: 'ges-1000', meta: { volume: 1000 } },
  { type: 'Tank', name: 'GES 2000', slug: 'ges-2000', meta: { volume: 2000 } },
  // Valve
  { type: 'Valve', name: 'VABB D100', slug: 'babb-d100', meta: { diameter: 100 } },
  { type: 'Valve', name: 'VABB D300', slug: 'babb-d300', meta: { diameter: 300 } },
  { type: 'Valve', name: 'VABB D400', slug: 'babb-d400', meta: { diameter: 400 } },
  { type: 'Valve', name: 'VABB D600', slug: 'babb-d600', meta: { diameter: 600 } },
  // Other
  { type: 'Other', name: 'Power Generator 10KVA', slug: 'power-generator-10kva', meta: { } },

];
/* eslint-enable */
data = data.map(item => ({ ...item, id: `${item.type}-${slug(item.name)}` }));

module.exports = {
  data,
  init: async app => {
    let model = app.models.MaterialDetailType;
    await mapSeries(
      data,
      async detailType => {
        let record = dataUtil.defaultOperationData({ data: detailType, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err =>
        err
          ? console.error('Test data MaterialDetailType error', err) // eslint-disable-line no-console
          : console.log('Test data MaterialDetailType OK!'), // eslint-disable-line no-console
    );
    return true;
  },
};
