import { RolePermissionIcon, ViewIcon } from '../../styles/Icons';
import NestedList from './NestedList';

export default {
  name: 'rolePermission',
  icon: RolePermissionIcon,
  label: 'generic.pages.rolePermission',
  url: 'rolePermissions',
  screens: {
    main: NestedList,
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
      icon: RolePermissionIcon,
      label: 'resources.rolepermissions.save',
    },
    read: [],
    write: [],
  },
};
