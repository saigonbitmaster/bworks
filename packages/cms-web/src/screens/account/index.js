import { Add, Create, Delete } from '@material-ui/icons';
import { ClientIcon, ViewIcon, BanIcon } from '../../styles/Icons';
import ListAppUser from './ListAppUser';
import EditAppUser from './EditAppUser';
import CreateAppUser from './CreateAppUser';

//just to test
export default {
  name: 'appuser',
  label: 'generic.pages.appUser',
  icon: ClientIcon,
  url: 'appusers',
  screens: {
    main: ListAppUser,
    create: CreateAppUser,
    edit: EditAppUser,
  },
  resources: ['appusers'],
  active: true,
  access: {

    view: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/AppUsers/getRolesByAppUserId', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/AppUsers/{id}', method: 'put' },
      ],
      icon: ViewIcon,
      label: 'resources.appusers.view',
    },
    ban: {
      apis: [{ url: '/AppUsers/banUser', method: 'post' }],
      icon: BanIcon,
      label: 'resources.appusers.ban',
    },
    edit: {
      apis: [
        { url: '/Roles', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/AppUsers/{id}', method: 'get' },
        { url: '/AppUsers/getRolesByAppUserId', method: 'get' },
        { url: '/AppUsers/saveAppUser', method: 'post' },
      ],
      icon: Create,
      label: 'resources.appusers.edit',
    },
    create: {
      apis: [
        { url: '/Roles', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/AppUsers/getRolesByAppUserId', method: 'get' },
        { url: '/AppUsers/saveAppUser', method: 'post' },
      ],
      icon: Add,
      label: 'resources.appusers.create',
    },
    delete: {
      apis: [{ url: '/AppUsers/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.appusers.delete',
    },
    read: [],
    write: [],
  
  },
};
