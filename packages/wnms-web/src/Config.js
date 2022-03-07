export default {
  projectKey: 'nms',
  mapApiKey: 'AIzaSyBZ63aR_cp2P3vVsGmyW5LN7BnKLCQil2M',
  gaId: 'UA-120553426-1',
  // mapDefaultCenter: { lat: 21.027832, lng: 106.986424 }, //
  mapDefaultCenter: { lat: 19.806741, lng: 105.773001 },
  mapDefaultZoom: 14,
  ZOOM_LIMIT_TO_SHOW_TEXT_MARKER: 13, // gia tri zoom toi thieu cua map de show text tren marker dataloger(dashboard)
  color: {
    waterLossChart: {
      // WATERINPUT: '#3F51B5',
      // WATERREVENUE: '#4dbd74',
      // KNOWLEAK: '#FF9800',
      // UNKNOWLEAK: '#ff5454',

      mainConsumption: '#3F51B5', // san luong dau vao
      subConsumption: '#4dbd74', // san luong dau ra
      mainternance: '#FF9800', // suc xa
      leak: '#ff5454', // that thoat
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
  },
  numberDec: 2, // so thap phan
  PER_PAGE_MANAGE_MATERIAL: 5,
  materialGroup: {
    Pipe: 'resources.materialstocks.types.pipe',
    FlowLogger: 'resources.materialstocks.types.flowLogger',
    ElectricLogger: 'resources.materialstocks.types.electricLogger',
    QualityLogger: 'resources.materialstocks.types.qualityLogger',
    Meter: 'resources.materialstocks.types.meter',
    Filter: 'resources.materialstocks.types.filter',
    PressureReducing: 'resources.materialstocks.types.pressureReducing',
    Pump: 'resources.materialstocks.types.pump',
    Tank: 'resources.materialstocks.types.tank',
    Valve: 'resources.materialstocks.types.valve',
    Other: 'resources.materialstocks.types.other',
  },
  materialChoices: [
    { id: 'Pipe', name: 'resources.materialstocks.types.pipe' },
    { id: 'FlowLogger', name: 'resources.materialstocks.types.flowLogger' },
    { id: 'ElectricLogger', name: 'resources.materialstocks.types.electricLogger' },
    { id: 'QualityLogger', name: 'resources.materialstocks.types.qualityLogger' },
    { id: 'Meter', name: 'resources.materialstocks.types.meter' },
    { id: 'Filter', name: 'resources.materialstocks.types.filter' },
    { id: 'PressureReducing', name: 'resources.materialstocks.types.pressureReducing' },
    { id: 'Pump', name: 'resources.materialstocks.types.pump' },
    { id: 'Tank', name: 'resources.materialstocks.types.tank' },
    { id: 'Valve', name: 'resources.materialstocks.types.valve' },
    { id: 'Other', name: 'resources.materialstocks.types.other' },
  ],

  healthChoices: [
    { id: 'OK', name: 'resources.materialuses.healths.ok' },
    { id: 'WARN', name: 'resources.materialuses.healths.warn' },
    { id: 'BAD', name: 'resources.materialuses.healths.bad' },
  ],
  healthGroup: {
    OK: 'resources.materialuses.healths.ok',
    WARN: 'resources.materialuses.healths.warn',
    BAD: 'resources.materialuses.healths.bad',
  },
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
  alertType: [
    { id: '1', name: 'resources.nmsalertthresholds.alertHigh' },
    { id: '2', name: 'resources.nmsalertthresholds.alertLow' },
    { id: '3', name: 'resources.nmsalertthresholds.alertHighAndLow' },
  ],
  alertParam: [
    { id: '1', name: 'resources.nmsalertthresholds.alertQuality' },
    // { id: '2', name: 'resources.nmsalertthresholds.alertFlow' },
    // { id: '3', name: 'resources.nmsalertthresholds.alertVolume' },
  ],
  waterParameter: [
    { id: 'ntu', name: 'generic.symbol.ntu' },
    { id: 'ph', name: 'generic.symbol.ph' },
    { id: 'cod', name: 'generic.symbol.cod' },
  ],
};
