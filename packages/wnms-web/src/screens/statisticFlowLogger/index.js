import { StatisticIcon } from '../../styles/Icons';
import StatisticFlowLogger from './StatisticFlowLogger';

export default {
  name: 'Dashboard',
  label: 'generic.pages.statisticFlowLogger',
  icon: StatisticIcon,
  url: 'statisticFlowLogger/:id',
  screens: {
    main: { component: StatisticFlowLogger },
  },
  access: {
    read: [],
    write: [],
  },
};
