// import { Add } from '@material-ui/icons';
import { EmployeeAppIcon } from '../styles/Icons';
export default {
  name: 'employeeSmartPhone',
  label: 'generic.pages.employeeSmartPhone',
  icon: EmployeeAppIcon,
  url: 'employeeSmartPhone',
  resources: [],
  active: true,
  access: {
    // dasboard: {
    //   apis: [
    //     // dashboard
    //     { url: '/Factories', method: 'get' },
    //     { url: '/Dmas/statisticQuantityByMonth', method: 'get' },
    //     { url: '/MaterialUses/summaryDataLogger', method: 'get' },
    //     { url: '/Dmas/summaryQuantity', method: 'get' },
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.dashboard',
    // },
    // mapDataLogger: {
    //   apis: [
    //     // ban do dataloger
    //     { url: '/MaterialUses/statisticSumFlowLoggerYear', method: 'get' },
    //     { url: '/MaterialUses/statisticSumFlowLoggerMonth', method: 'get' },
    //     { url: '/MaterialUses/statisticSumFlowLoggerDay', method: 'get' },
    //     { url: '/MaterialUses/statisticSumFlowLoggerHour', method: 'get' },
    //     { url: '/MaterialUses/statisticRuntimeLoggerHour', method: 'get' },
    //     { url: '/MaterialUses/statisticSumFlowLoggerNow', method: 'get' },
    //     { url: '/MaterialUses/{id}', method: 'get' },
    //     { url: '/Dmas/currentStatus', method: 'get' },
    //     { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.mapDataLogger',
    // },
    // mapPressure: {
    //   apis: [
    //     // Ban do ap luc
    //     { url: '/Dmas/currentStatus', method: 'get' },
    //     { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.mapPressure',
    // },
    // mapWaterLoss: {
    //   apis: [
    //     // ban do that thoat
    //     { url: '/Dmas/mapWaterLoss', method: 'get' },
    //     { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.mapWaterLoss',
    // },
    // listDataLogger: {
    //   apis: [
    //     // danh sach datalogger
    //     { url: '/Dmas/currentStatus', method: 'get' },
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.listDataLogger',
    // },
    // chartPressure: {
    //   apis: [
    //     // chart luu luong/ap luc
    //     { url: '/MaterialUses/statisticRuntimeLoggerDay', method: 'get' },
    //     { url: '/MaterialUses', method: 'get' },
    //     { url: '/Dmas', method: 'get' },
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.chartPressure',
    // },
    // chartWaterLoss: {
    //   apis: [
    //     // chart san luong/that thoat
    //     { url: '/Dmas/statisticQuantityByMonth', method: 'get' },
    //     { url: '/Dmas', method: 'get' },
    //   ],
    //   icon: Add,
    //   label: 'generic.permission.appMobile.chartWaterLoss',
    // },
    view: {
      apis: [
        // dashboard
        { url: '/Factories', method: 'get' },
        { url: '/Dmas/statisticQuantityByMonth', method: 'get' },
        { url: '/MaterialUses/summaryDataLogger', method: 'get' },
        { url: '/Dmas/summaryQuantity', method: 'get' },

        // ban do dataloger
        { url: '/MaterialUses/statisticSumFlowLoggerYear', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerMonth', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerDay', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerHour', method: 'get' },
        { url: '/MaterialUses/statisticRuntimeLoggerHour', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerNow', method: 'get' },
        { url: '/MaterialUses/{id}', method: 'get' },
        { url: '/Dmas/currentStatus', method: 'get' },
        { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter

        // Ban do ap luc
        // { url: '/Dmas/currentStatus', method: 'get' },
        // { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter

        // ban do that thoat
        { url: '/Dmas/mapWaterLoss', method: 'get' },
        // { url: '/NmsConfigs/{id}', method: 'get' }, // MapDefaultCenter

        // danh sach datalogger
        // { url: '/Dmas/currentStatus', method: 'get' },

        // chart luu luong/ap luc
        { url: '/MaterialUses/statisticRuntimeLoggerDay', method: 'get' },
        { url: '/MaterialUses', method: 'get' },
        { url: '/Dmas', method: 'get' },

        // chart san luong/that thoat
        // { url: '/Dmas/statisticQuantityByMonth', method: 'get' },
        // { url: '/Dmas', method: 'get' },
      ],
    },
  },
};
