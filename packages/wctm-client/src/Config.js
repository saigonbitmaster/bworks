export default {
  projectKey: 'client',
  mapApiKey: 'AIzaSyBZ63aR_cp2P3vVsGmyW5LN7BnKLCQil2M',
  gaId: 'UA-120553426-1',
  mapDefaultCenter: { lat: 19.806339, lng: 105.765045 },
  mapDefaultZoom: 14,
  domainQuality: {
    ph: [0, 15],
    ntu: [0, 10],
    clo: [0, 1],
  },
  color: {
    waterLossChart: {
      WATERINPUT: '#3F51B5',
      WATERREVENUE: '#4dbd74',
      KNOWLEAK: '#FF9800',
      UNKNOWLEAK: '#ff5454',
    },
    flowPressureChart: [
      '#4dbd74',
      '#ff5454',
      '#3F51B5',
      '#FF9800',
      '#8884d8',
      '#FFEB3B',
      '#AA00FF',
      '#2962FF',
      '#616161',
      '#82ca9d',
    ],
    qualityWaterChart: [
      '#4dbd74',
      '#ff5454',
      '#3F51B5',
      '#FF9800',
      '#8884d8',
      '#FFEB3B',
      '#AA00FF',
      '#2962FF',
      '#616161',
      '#82ca9d',
    ],
  },
  client: {
    clientTypeChoices: [
      { id: 'RESIDENT', name: 'generic.client.clientTypeChoices.resident' },
      { id: 'ORGANIZATION', name: 'generic.client.clientTypeChoices.organization' },
      { id: 'INDUSTRY', name: 'generic.client.clientTypeChoices.industry' },
      { id: 'SERVICE', name: 'generic.client.clientTypeChoices.service' },
    ],
    statusChoices: [
      { id: null, name: '' },
      { id: 'ACTIVE', name: 'generic.client.statusChoices.active' },
      { id: 'PAUSE', name: 'generic.client.statusChoices.pause' },
      { id: 'STOP', name: 'generic.client.statusChoices.stop' },
    ],
    registerStatusChoices: [
      { id: 'NEW', name: 'generic.client.actionChoices.new' },
      { id: 'CONTRACT_SIGNED', name: 'generic.client.actionChoices.contractSigned' },
    ],
    actionChoices: [
      { id: 'NEW', name: 'generic.client.actionChoices.new' },
      { id: 'CONTRACT_SIGNED', name: 'generic.client.actionChoices.contractSigned' },
      { id: 'INSTALL_WAITING', name: 'generic.client.actionChoices.installWaiting' },
      { id: 'COMPLETE', name: 'generic.client.actionChoices.complete' },
    ],
    typeRequestChoices: [
      { id: 'NEW_INSTALL', name: 'generic.client.typeRequestChoices.newInstall' },
      { id: 'REPLACE', name: 'generic.client.typeRequestChoices.replace' },
    ],
  },
  eInvoice: {
    paymentTypeChoices: [
      { id: 'TRANSFER', name: 'generic.paymentTypeChoices.transfer' },
      { id: 'CASH', name: 'generic.paymentTypeChoices.cash' },
      { id: 'ALL', name: 'generic.paymentTypeChoices.all' },
    ],
    buyerIdTypeChoices: [
      { id: '1', name: 'generic.buyerIdTypeChoices.1' },
      { id: '2', name: 'generic.buyerIdTypeChoices.2' },
      { id: '3', name: 'generic.buyerIdTypeChoices.3' },
    ],
    paymentProviderChoices: [
      { id: 'VNPAY', name: 'VNPay' },
      { id: 'MOMO', name: 'MoMo' },
    ],
  },
  formula: {
    unitChoices: [
      { id: 'PERSON', name: 'generic.formula.unitChoices.person' },
      { id: 'FAMILY', name: 'generic.formula.unitChoices.family' },
    ],
  },
  geoChoices: [
    { id: 'province', name: 'generic.pages.geoprovince' },
    { id: 'district', name: 'generic.pages.geodistrict' },
    { id: 'ward', name: 'generic.pages.geoward' },
  ],

  mapTranslate: {
    paymentTypes: {
      TRANSFER: 'generic.paymentTypeChoices.transfer',
      CASH: 'generic.paymentTypeChoices.cash',
      ALL: 'generic.paymentTypeChoices.all',
    },
    clientTypes: {
      RESIDENT: 'generic.client.clientTypeChoices.resident',
      ORGANIZATION: 'generic.client.clientTypeChoices.organization',
      INDUSTRY: 'generic.client.clientTypeChoices.industry',
      SERVICE: 'generic.client.clientTypeChoices.service',
    },
    statusClients: {
      ACTIVE: 'generic.client.statusChoices.active',
      PAUSE: 'generic.client.statusChoices.pause',
      STOP: 'generic.client.statusChoices.stop',
    },
    buyerIdTypes: {
      1: 'generic.buyerIdTypeChoices.1',
      2: 'generic.buyerIdTypeChoices.2',
      3: 'generic.buyerIdTypeChoices.3',
    },
  },
};
