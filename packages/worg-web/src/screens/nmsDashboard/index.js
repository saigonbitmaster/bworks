import { StatusIcon } from '../../styles/Icons';
import StatisticFlowLogger from '../statisticFlowLogger/StatisticFlowLogger';
import Dashboard from './Dashboard';

export default {
  name: 'Dashboard',
  label: 'generic.pages.nmsDashboard',
  icon: StatusIcon,
  url: 'nms',
  screens: {
    main: { component: Dashboard },
    statisticFlowLogger: { component: StatisticFlowLogger, subPath: ':id' },
  },
  access: {
    read: [],
    write: [],
  },
};
