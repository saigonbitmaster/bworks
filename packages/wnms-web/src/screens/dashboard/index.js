import {
  DashboardIcon,
  QuantityIcon,
  FlowLoggerIcon,
  WaterLossIcon,
  FactoryIcon,
  StatusIcon,
} from '../../styles/Icons';
import StatisticFlowLogger from '../statisticFlowLogger/StatisticFlowLogger';
import Main from './Main';
// eslint-disable-next-line import/named
import { ScadaView } from 'web-common';
// import Dashboard from './Dashboard';
import SubQualityLogger from '../subQualityLogger/SubQualityLogger';

export default {
  name: 'Dashboard',
  label: 'generic.pages.dashboard',
  icon: DashboardIcon,
  url: '',
  screens: {
    main: { component: Main, exact: true },
    statisticFlowLogger: { component: StatisticFlowLogger, subPath: ':id' },
    scada: { component: ScadaView },
    subQualityLogger: { component: SubQualityLogger, subPath: ':id' },
  },
  access: {
    quantity: {
      apis: [{ url: '/Dmas/summaryQuantity', method: 'get' }],
      icon: QuantityIcon,
      label: 'generic.widgets.quantity',
    },
    flowLogger: {
      apis: [{ url: '/MaterialUses/summaryDataLogger', method: 'get' }],
      icon: FlowLoggerIcon,
      label: 'generic.widgets.flowLogger',
    },
    waterLoss: {
      apis: [{ url: '/Dmas/statisticQuantityByMonth', method: 'get' }],
      icon: WaterLossIcon,
      label: 'generic.widgets.waterLoss',
    },
    factory: {
      apis: [{ url: '/Factories', method: 'get' }],
      icon: FactoryIcon,
      label: 'generic.widgets.factory',
    },
    currentStatus: {
      apis: [
        { url: '/NmsConfigs', method: 'get' },
        { url: '/Dmas/currentStatus', method: 'get' },
        { url: '/NmsConfigs/{id}', method: 'get' },
        { url: '/Maps/kml', method: 'get' },
        { url: '/MaterialUses/{id}', method: 'get' },
        { url: '/MaterialUses/statisticRuntimeLoggerHour', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerHour', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerDay', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerMonth', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerYear', method: 'get' },
        { url: '/MaterialUses/statisticSumFlowLoggerNow', method: 'get' },
      ],
      icon: StatusIcon,
      label: 'generic.permission.viewMapDmaDataLogger',
    },
    scada: {
      apis: [],
      icon: FactoryIcon,
      label: 'generic.widgets.scada',
    },
  },
};
