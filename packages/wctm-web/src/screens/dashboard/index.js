import {
  DashboardIcon,
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
  label: 'generic.pages.dashboard',
  icon: DashboardIcon,
  url: '',
  screens: {
    main: { component: Dashboard, exact: true },
  },
  access: {
    customer: {
      apis: [{ url: '/Clients/status', method: 'get' }],
      icon: CustomerIcon,
      label: 'resources.clients.dashboard.customer',
    },
    revenue: {
      apis: [{ url: '/Clients/widgetRevenue', method: 'get' }],
      icon: RevenueIcon,
      label: 'resources.clients.dashboard.revenue',
    },
    waterQuantity: {
      apis: [{ url: '/Clients/widgetWaterQuantity', method: 'get' }],
      icon: WidgetWaterQuantityIcon,
      label: 'resources.clients.dashboard.waterQuantity',
    },
    waterLoss: {
      apis: [{ url: '/Clients/widgetWaterLoss', method: 'get' }],
      icon: WidgetWaterLossIcon,
      label: 'resources.clients.dashboard.waterLoss',
    },
    statisticRevenue: {
      apis: [{ url: '/Clients/statisticRevenue', method: 'get' }],
      icon: ChartStatisticRevenueIcon,
      label: 'resources.clients.dashboard.statisticRevenue',
    },
    statisticPayment: {
      apis: [{ url: '/Clients/statisticRevenue', method: 'get' }],
      icon: ChartStatisticPaymentIcon,
      label: 'resources.clients.dashboard.statisticPayment',
    },
    statisticClientWriteWater: {
      apis: [{ url: '/Clients/statisticClientWriteWater', method: 'get' }],
      icon: ChartStatisticClientWriteWaterIcon,
      label: 'resources.clients.dashboard.statisticClientWriteWater',
    },
    statisticQuantityWater: {
      apis: [{ url: '/Clients/statisticQuantityWater', method: 'get' }],
      icon: ChartStatisticQuantityWaterIcon,
      label: 'resources.clients.dashboard.statisticQuantityWater',
    },
  },
};
