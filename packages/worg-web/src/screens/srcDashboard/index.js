import { WaterSourceIcon } from '../../styles/Icons';
import Dashboard from './Dashboard';

export default {
  name: 'Dashboard',
  label: 'generic.pages.srcDashboard',
  icon: WaterSourceIcon,
  url: 'src',
  screens: {
    main: { component: Dashboard },
  },
  access: {
    read: [],
    write: [],
  },
};
