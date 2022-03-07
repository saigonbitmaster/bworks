import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  name: 'Network configuration |||| Network configuration',
  fields: {
    id: 'Name',
    ids: {
      MapDefaultCenter: 'Map default center',
      MapDefaultZoom: 'Map zoom',
      PressureLimit: 'Max pressure',
      QualityFluo: 'Fluorescein alert',
      QualityPh: 'PH alert',
      Flow: 'Flow rate',
      Pressure: 'Pressure',
      StatisticMatStk: 'Stocked material report',
      StatisticMatDMA: 'By DMA material report',
      StatisticMatLifeSpan: 'Lifespan material report',
      RateWaterLeak: 'Leak rate',
    },
    side: 'Side',
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
  listTitle: 'Configuration list',
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
    high: 'High stocked status (%)',
  },
  statisticMatDMA: {
    high: 'High stocked status (%)',
  },
  statisticMatLifeSpan: {
    existTime: 'In lifespan (months)',
    lessTime: 'Near expiration (months)',
  },
  rateWaterLeak: {
    warning: 'Low Rate Leak (>=) (%)',
    high: 'High Rate Leak (>=) (%)',
  },
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
};
