import { DashboardIcon } from '../../styles/Icons';
import Board from './Board';

export default {
  name: 'Dashboard',
  label: 'generic.pages.dashboard',
  icon: DashboardIcon,
  url: '',
  screens: {
    main: { component: Board, exact: true },
  },
  resources: ['appusers'],
  access: {
    read: [],
    write: [],
  },
};
