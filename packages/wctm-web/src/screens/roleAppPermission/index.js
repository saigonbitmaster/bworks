import { RoleAppPermissionIcon, ViewIcon } from '../../styles/Icons';
import AppPermissionList from './AppPermissionList';

export default {
  name: 'roleAppPermission',
  icon: RoleAppPermissionIcon,
  label: 'generic.pages.roleAppPermission',
  url: 'roleAppPermission',
  screens: {
    main: AppPermissionList,
  },
  resources: ['roles'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Roles', method: 'get' },
        { url: '/AppUsers/getPathsByRoleAndProject', method: 'post' },
        { url: '/PackageConfigs/{id}', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.rolepermissions.view',
    },
    save: {
      apis: [{ url: '/AppUsers/setAccessForRole', method: 'post' }],
      icon: RoleAppPermissionIcon,
      label: 'resources.rolepermissions.save',
    },
    read: [],
    write: [],
  },
};
