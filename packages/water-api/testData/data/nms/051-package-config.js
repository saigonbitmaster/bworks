const dataUtil = require('ra-loopback3/server/utils/data');
const { mapSeries } = require('async');
const data = [
  // collection: PackageConfig
  {
    id: 'nms',
    data: {
      Dashboard: true,
      Design: true,
      Monitoring: true,
      StatisticMatByDma: true,
      statisticMatByLifeSpan: true,
      StatisticMatInStk: true,
      WaterLoss: true,
      WaterFlowPressure: true,
      MatDetailType: true,
      ManageMat: true,
      MapWaterLoss: true,
      MaterialOnMap: true,
      ParentMenuStatistic: true,
      StatisticMatByLifeSpan: true,
      Report: true,
      ParentMenuMat: true,
      InputKml: true,
      Permission: true,
      Appuser: true,
      Role: true,
      RolePermission: true,
      WaterMaintenance: true,
      Configuration: true,
      Employment: true,
      Taskboard: true,
      changePassword: true,
      employeeSmartPhone: true,
      PumpStation: true,
      Standard: true,
      AlertThreshold: true,
      MapQualityLogger: true,
    },
    description: '',
  },
];
module.exports = {
  init: async app => {
    let model = app.models.PackageConfig;
    mapSeries(
      data,
      async item => {
        let record = dataUtil.defaultOperationData({ data: item, app });
        await model.replaceOrCreate(record);
        return true;
      },
      err => (err ? console.error('init nms PackageConfig error', err) : console.log('init PackageConfig OK!')), // eslint-disable-line no-console
    );
  },
};
