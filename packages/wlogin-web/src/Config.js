export default {
  mapApiKey: 'AIzaSyBZ63aR_cp2P3vVsGmyW5LN7BnKLCQil2M',
  gaId: 'UA-120553426-1',
  mapDefaultCenter: { lat: 19.806339, lng: 105.765045 },
  center: { lat: 19.806339, lng: 105.765045 },
  mapDefaultZoom: 14,
  color: {
    waterLossChart: {
      WATERINPUT: '#3F51B5',
      WATERREVENUE: '#4dbd74',
      KNOWLEAK: '#FF9800',
      UNKNOWLEAK: '#ff5454',
    },
    status: {
      loss: '#5d4037',
      low: '#fbc02d',
      normal: '#3f51b5',
      ok: '#4caf50',
      high: '#ef6c00',
      ng: '#ba000d',
      error: '#f44336',
      critical: '#a31545',
      alert: '#fbc02d',
      criticalAlert: '#a31545',
    },
    flowPressureChart: [
      '#3F51B5',
      '#4dbd74',
      '#FF9800',
      '#ff5454',
      '#8884d8',
      '#FFEB3B',
      '#AA00FF',
      '#2962FF',
      '#616161',
      '#82ca9d',
    ],
    basicChart: [
      '#3F51B5',
      '#4dbd74',
      '#FF9800',
      '#ff5454',
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
  partnerType: [
    { id: '1', name: 'generic.pages.agent' },
    { id: '2', name: 'generic.pages.supplier' },
  ],
  modelChoices: [
    { id: 'Client', name: 'generic.pages.client' },
    { id: 'ClientRegister', name: 'generic.pages.clientRegister' },
  ],
  interfaceStandardType: [{ name: 'MM' }, { name: 'DM' }, { name: 'DD' }, { name: 'MD' }],
  waterParameterStage: [
    { id: '1', name: 'resources.waterstandards.fields.sourceWater' },
    { id: '2', name: 'resources.waterstandards.fields.processingWater' },
    { id: '3', name: 'resources.waterstandards.fields.freshWater' },
    { id: '4', name: 'resources.waterstandards.fields.processingAndFreshWater' },
    { id: '5', name: 'resources.waterstandards.fields.all' },
  ],
  environmentalRating: [{ name: 'IP65' }, { name: 'IP66' }, { name: 'IP67' }, { name: 'IP68' }, { name: 'IP69' }],
  powerSource: [
    { id: '1', name: 'resources.dataloggers.fields.gridPower' },
    { id: '2', name: 'resources.dataloggers.fields.battery' },
    { id: '3', name: 'resources.dataloggers.fields.solar' },
  ],
  typeOfSensor: [
    { id: '1', name: 'resources.sensors.fields.physical' },
    { id: '2', name: 'resources.sensors.fields.chemical' },
    { id: '3', name: 'resources.sensors.fields.bio' },
  ],
  typeOfPump: [
    { id: '1', name: 'resources.pumps.fields.surfaceWaterPump' },
    { id: '2', name: 'resources.pumps.fields.groundWaterPump' },
  ],
  typeOfWaterSource: [
    { id: '1', name: 'resources.watersources.fields.surfaceWater' },
    { id: '2', name: 'resources.watersources.fields.groundWater' },
  ],
  typeOfWaterSourceGroup: [
    { id: '1', name: 'resources.watersourcegroups.fields.activeGroup' },
    { id: '2', name: 'resources.watersourcegroups.fields.backupGroup' },
    { id: '3', name: 'resources.watersourcegroups.fields.reservedGroup' },
  ],
  alertType: [
    { id: '1', name: 'resources.alertthresholds.alertHigh' },
    { id: '2', name: 'resources.alertthresholds.alertLow' },
    { id: '3', name: 'resources.alertthresholds.alertHighAndLow' },
  ],
  sourceStatus: [
    { id: '1', name: 'resources.watersources.fields.normal' },
    { id: '2', name: 'resources.watersources.fields.inMaintain' },
    { id: '3', name: 'resources.watersources.fields.isStopped' },
  ],
  alertParam: [
    { id: '1', name: 'resources.alertthresholds.alertQuality' },
    { id: '2', name: 'resources.alertthresholds.alertFlow' },
    { id: '3', name: 'resources.alertthresholds.alertVolume' },
  ],
  materialStatus: [
    { id: '1', name: 'resources.reportmaterials.statusGood' },
    { id: '2', name: 'resources.reportmaterials.statusDamageField' },
    { id: '3', name: 'resources.reportmaterials.statusDamageAndRevoked' },
    { id: '4', name: 'resources.reportmaterials.statusDamageSentMaintain' },
  ],
  filterConditions: [
    {
      id: '1',
      name: 'resources.reportmaterials.byMaterialStatus',
      conditions: [
        { id: '1', name: 'resources.reportmaterials.statusGood' },
        { id: '2', name: 'resources.reportmaterials.statusDamageField' },
        { id: '3', name: 'resources.reportmaterials.statusDamageAndRevoked' },
        { id: '4', name: 'resources.reportmaterials.statusDamageSentMaintain' },
      ],
    },
    {
      id: '2',
      name: 'resources.reportmaterials.byMaterialAge',
      conditions: [
        { id: '1', name: 'resources.reportmaterials.expired' },
        { id: '2', name: 'resources.reportmaterials.nearExpired' },
        { id: '3', name: 'resources.reportmaterials.inValid' },
      ],
    },
  ],

  selectAll: [{ id: 'all', name: 'generic.selectAll' }],
};
