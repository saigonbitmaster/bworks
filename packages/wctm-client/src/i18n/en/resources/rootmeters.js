import commonFields from '../commomFields';
export default {
  name: 'Master meter |||| Master meter',
  fields: {
    name: 'Name',
    meterLevel: 'Meter level',
    seri: 'Seri',
    providerId: 'Provider',
    providerZoneId: 'Provider area',
    dmaId: 'DMA',
    parentMeterId: 'Parent meter',
    ...commonFields,
  },
};
