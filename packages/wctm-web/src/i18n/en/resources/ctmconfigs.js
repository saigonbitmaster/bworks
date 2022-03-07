import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  name: 'Network configuration |||| Network configuration',
  fields: {
    id: 'Name',
    ids: {
      MapDefaultCenter: 'Map default center',
      MapDefaultZoom: 'Map default zoom',
      PressureLimit: 'Pressure limit',
      QualityFluo: 'Fluorescein alert',
      QualityPh: 'PH alert',
      Flow: 'Flow',
      Pressure: 'Pressure',
      StatisticMatStk: 'Report stock material',
      StatisticMatDMA: 'Report deployed material by DMA',
      StatisticMatLifeSpan: 'Report material age',
      ClientWriteMeterNumberDate: 'Client meter record date',
      ClientMeterNumberExpiredDate: 'Client meter days to expire',
    },
    side: 'Side',
    sides: {
      all: 'All',
      frontend: 'Frontend',
      backend: 'Backend',
    },
    value: 'Value',
    values: {
      number: 'Value',
      lat: 'latitude',
      lng: 'Longitude',
    },
    ...commonFields,
  },
  listTitle: 'Configuration list',
  createTitle: 'Create',
  editTitle: 'Edit',
  pressure: {
    high: 'High alert (%)',
    low: 'Low alert (%)',
    loss: 'Water loss alert (%)',
  },
  flow: {
    high: 'High alert (%)',
  },
  statisticMatStk: {
    high: 'High stock alert (%)',
  },
  statisticMatDMA: {
    high: 'High stock alert (%)',
  },
  statisticMatLifeSpan: {
    existTime: 'In valid (months)',
    lessTime: 'Near to expire (months)',
  },
  // <Permission>
  view: 'View configuration list',
  create: 'Create new configuration',
  edit: 'Edit configuration',
  delete: 'Delete configuration',
  // </Permission>
};
