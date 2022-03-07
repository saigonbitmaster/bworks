import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  name: 'Network configuration |||| Network configuration',
  fields: {
    id: 'Name',
    ids: {
      MapDefaultCenter: 'Map default location',
      MapDefaultZoom: 'Map zoom',
      PressureLimit: 'Max pressure',
      QualityFluo: 'Fluorescein alert',
      QualityPh: 'PH alert',
      Flow: 'FlowRate',
      Pressure: 'Pressure',
      StatisticMatStk: 'Report stocked material',
      StatisticMatDMA: 'Report material by DMA',
      StatisticMatLifeSpan: 'Report material lifespan',
      ClientWriteMeterNumberDate: 'Meter record date',
    },
    side: 'Sides',
    sides: {
      all: 'All',
      frontend: 'Frontend',
      backend: 'Backend',
    },
    value: 'Value',
    values: {
      number: 'Number',
      lat: 'Latitude',
      lng: 'Longtitude',
    },
    ...commonFields,
  },
  listTitle: 'List configurations',
  createTitle: 'Create configuration',
  editTitle: 'Edit configuration',
  pressure: {
    high: 'High alert (%)',
    low: 'Low alert (%)',
    loss: 'Service stopped alert (%)',
  },
  flow: {
    high: 'High alert (%)',
  },
  statisticMatStk: {
    high: 'High stocked material (%)',
  },
  statisticMatDMA: {
    high: 'High stocked material (%)',
  },
  statisticMatLifeSpan: {
    existTime: 'Valid (months)',
    lessTime: 'Near expire (months)',
  },
};
