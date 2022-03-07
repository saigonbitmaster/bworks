import { Add, Create } from '@material-ui/icons';
import { NotificationsIcon, DeleteIcon } from '../../styles/Icons';
import ListNotify from './ListNotify';
import CreateNotify from './CreateNotify';
import EditNotify from './EditNotify';
export default {
  name: 'notifySetting',
  label: 'generic.pages.notifySetting',
  icon: NotificationsIcon,
  url: 'notifySetting',
  screens: {
    main: ListNotify,
    create: CreateNotify,
    edit: EditNotify,
  },
  resources: ['jobsystems'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/JobSystems', method: 'get' }],
      icon: NotificationsIcon,
      label: 'resources.formulas.view',
    },
    edit: {
      apis: [
        { url: '/JobSystems/{id}', method: 'get' },
        { url: '/JobSystems/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.formulas.edit',
    },
    create: {
      apis: [{ url: '/JobSystems', method: 'post' }],
      icon: Add,
      label: 'resources.formulas.create',
    },
    delete: {
      apis: [{ url: '/JobSystems/{id}', method: 'delete' }],
      icon: DeleteIcon,
      label: 'resources.formulas.delete',
    },
    read: [],
    write: [],
  },
};
