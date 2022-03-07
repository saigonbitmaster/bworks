export default {
  projectKey: 'ctm',
  appProjectKey: 'app-ctm',
  mapApiKey: 'AIzaSyBZ63aR_cp2P3vVsGmyW5LN7BnKLCQil2M',
  gaId: 'UA-120553426-1',
  mapDefaultCenter: { lat: 19.806339, lng: 105.765045 },
  mapDefaultZoom: 14,
  color: {
    waterLossChart: {
      WATERINPUT: '#3F51B5',
      WATERREVENUE: '#4dbd74',
      KNOWLEAK: '#FF9800',
      UNKNOWLEAK: '#ff5454',
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
      { id: 'INSTALL_WAITING', name: 'generic.client.actionChoices.installWaiting' },
      { id: 'COMPLETE', name: 'generic.client.actionChoices.complete' },
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
    writeChoices: [
      { id: true, name: 'generic.client.writeChoices.written' },
      { id: false, name: 'generic.client.writeChoices.notWritten' },
    ],
    payChoices: [
      { id: 'paid', name: 'generic.client.payChoices.paid' },
      { id: 'notUsed', name: 'generic.client.payChoices.notUsed' },
      { id: 'notPaid', name: 'generic.client.payChoices.notPaid' },
    ],
    inspectMeterNumber: {
      submitStatus: [
        { id: 'PASSED', name: 'resources.inspectmeternumber.submitStatus.PASSED' },
        { id: 'WAITING', name: 'resources.inspectmeternumber.submitStatus.WAITING' },
        { id: 'DENIED', name: 'resources.inspectmeternumber.submitStatus.DENIED' },
      ],
      declineMessage: [
        {
          name: 'resources.inspectmeternumber.declineMessage.meterImage',
          id: 'meterImage',
          value: 'Xin Quý Khách hàng cung cấp lại hình ảnh đồng hồ',
        },
        {
          name: 'resources.inspectmeternumber.declineMessage.meterNumber',
          id: 'meterNumber',
          value: 'Xin Quý Khách hàng cung cấp lại số nước',
        },
      ],
    },
  },
  eInvoice: {
    buyerIdTypeChoices: [
      { id: '1', name: 'generic.buyerIdTypeChoices.1' },
      { id: '2', name: 'generic.buyerIdTypeChoices.2' },
      { id: '3', name: 'generic.buyerIdTypeChoices.3' },
    ],
    einvoiceStatusChoices: [
      { id: 'isExported', name: 'generic.einvoiceStatusChoices.isExported' },
      { id: 'isNotExported', name: 'generic.einvoiceStatusChoices.isNotExported' },
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
    { id: 'Clients', name: 'generic.pages.client' },
    { id: 'ClientRegisters', name: 'generic.pages.clientRegister' },
  ],
  eInvoiceModeChoices: [
    { id: 'time', name: 'resources.einvoicereports.time' },
    { id: 'series', name: 'resources.einvoicereports.series' },
  ],
  mapConfigZoomLevel: {
    province: 15,
    district: 16,
    ward: 17,
  },
  maxLengthInvoiceNo: 7,
  notifySetting: {
    typeChoices: [
      { id: 'SCHEDULE', name: 'resources.notifysetting.typeChoice.SCHEDULE' },
      { id: 'RUN_NOW', name: 'resources.notifysetting.typeChoice.RUN_NOW' },
      { id: 'CUSTOM', name: 'resources.notifysetting.typeChoice.CUSTOM' },
    ],
    category: [
      { id: 'NOTIFY', name: 'resources.notifysetting.category.NOTIFY' },
      { id: 'EMAIL', name: 'resources.notifysetting.category.EMAIL' },
    ],
    target: [
      { id: 'employee', name: 'resources.notifysetting.target.employee' },
      { id: 'client', name: 'resources.notifysetting.target.client' },
    ],
    periodic: [
      { id: 'daily', name: 'resources.notifysetting.periodic.daily.unit' },
      { id: 'weekly', name: 'resources.notifysetting.periodic.weekly.unit' },
      { id: 'monthly', name: 'resources.notifysetting.periodic.monthly.unit' },
      { id: 'yearly', name: 'resources.notifysetting.periodic.yearly.unit' },
    ],
    weekly: [
      { id: 'S', name: 'resources.notifysetting.weekly.sunday', value: 'SUN' },
      { id: 'M', name: 'resources.notifysetting.weekly.monday', value: 'MON' },
      { id: 'T', name: 'resources.notifysetting.weekly.tuesday', value: 'TUE' },
      { id: 'W', name: 'resources.notifysetting.weekly.wednesday', value: 'WED' },
      { id: 'T', name: 'resources.notifysetting.weekly.thursday', value: 'THU' },
      { id: 'F', name: 'resources.notifysetting.weekly.friday', value: 'FRI' },
      { id: 'S', name: 'resources.notifysetting.weekly.saturday', value: 'SAT' },
    ],
    funtionGroupInvoiceTarget: [
      { id: true, name: 'resources.notifysetting.targetGroup.functionGroupTarget.invoice.paidInvoice' },
      { id: false, name: 'resources.notifysetting.targetGroup.functionGroupTarget.invoice.unpaidInvoice' },
    ],
    funtionGroupMeterNumberTarget: [
      { id: true, name: 'resources.notifysetting.targetGroup.functionGroupTarget.meternumber.writedMeterNumber' },
      { id: false, name: 'resources.notifysetting.targetGroup.functionGroupTarget.meternumber.unwritedMeterNumber' },
    ],
    status: [
      { id: 'RUNNING', name: 'resources.notifysetting.status.RUNNING' },
      { id: 'STOP', name: 'resources.notifysetting.status.STOP' },
      { id: 'WAITING', name: 'resources.notifysetting.status.WAITING' },
    ],
  },
};
