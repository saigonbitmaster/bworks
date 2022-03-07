import { OverviewMonitorIcon } from '../../styles/Icons';
import OverviewMonitor from './OverviewMonitor';
export default {
  name: 'overviewMonitor',
  label: 'generic.pages.overviewMonitor',
  icon: OverviewMonitorIcon,
  url: 'overviewMonitor',
  screens: {
    main: OverviewMonitor,
  },
  resources: ['dmas'],
  active: true,
  access: {},
  master: true,
};
