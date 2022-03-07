import { Add, Create } from '@material-ui/icons';
import { ClientIcon, ViewIcon, DeleteIcon } from '../../styles/Icons';
import ListRole from './ListRole';
import CreateRole from './CreateRole';
import EditRole from './EditRole';

export default {
  name: 'role',
  label: 'generic.pages.role',
  icon: ClientIcon,
  url: 'roles',
  screens: {
    main: ListRole,
    create: CreateRole,
    edit: EditRole,
  },
  resources: ['roles'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/Roles', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.roles.view',
    },
    edit: {
      apis: [
        { url: '/Roles/{id}', method: 'get' },
        { url: '/Roles/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.roles.edit',
    },
    delete: {
      apis: [{ url: '/Roles/isDeletable', method: 'get' }],
      icon: DeleteIcon,
      label: 'resources.roles.delete',
    },
    create: {
      apis: [{ url: '/Roles', method: 'post' }],
      icon: Add,
      label: 'resources.roles.create',
    },
    read: [],
    write: [],
  },
};
