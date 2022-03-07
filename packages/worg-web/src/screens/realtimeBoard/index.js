import { DashboardIcon } from '../../styles/Icons';
import RealtimeBoard from './RealtimeBoard';

export default {
  name: 'Dashboard',
  label: 'generic.pages.dashboard',
  icon: DashboardIcon,
  url: '',
  screens: {
    main: { component: RealtimeBoard, exact: true },
  },
  access: {
    read: [],
    write: [],
  },
};
