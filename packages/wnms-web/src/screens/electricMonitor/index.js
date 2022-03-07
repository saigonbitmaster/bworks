import { ElectricMonitorIcon } from '../../styles/Icons';
import Main from './Main';
export default {
  name: 'ElectricMonitor',
  label: 'generic.pages.electricMonitor',
  icon: ElectricMonitorIcon,
  url: 'electricMonitor',
  screens: {
    main: Main,
  },
  resources: ['pumpstations'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
