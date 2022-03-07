import {
  BusinessIcon,
  CustomerIcon,
  RevenueIcon,
  WidgetWaterQuantityIcon,
  WidgetWaterLossIcon,
  ChartStatisticRevenueIcon,
  ChartStatisticPaymentIcon,
  ChartStatisticClientWriteWaterIcon,
  ChartStatisticQuantityWaterIcon,
} from '../../styles/Icons';
import Dashboard from './Dashboard';

export default {
  name: 'Dashboard',
  label: 'generic.pages.ctmDashboard',
  icon: BusinessIcon,
  url: 'ctm',
  screens: {
    main: { component: Dashboard },
  },
  access: {
    statisticRevenue: {
      apis: [{ url: '/Clients/statisticRevenue', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.statisticRevenue',
    },
    clientGroupedByType: {
      apis: [{ url: '/Clients/getClientGroupedByType', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.clientGroupedByType',
    },
    clientGroupedByWaterUsage: {
      apis: [{ url: '/Clients/getClientGroupedByWaterUsage', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.clientGroupedByWaterUsage',
    },
    topDebtOverdueClientList: {
      apis: [{ url: '/ClientMeterNumbers/getTopDebtOverdueClients', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.topDebtOverdueClientList',
    },
    incomeGroupedByClientType: {
      apis: [{ url: '/ClientMeterNumbers/getIncomeGroupedByClientType', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.incomeGroupedByClientType',
    },
    incomeGroupedByGeo: {
      apis: [{ url: '/ClientMeterNumbers/getIncomeGroupedByGeo', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.incomeGroupedByGeo',
    },
  },
};
