import { ChangePasswordIcon } from '../../styles/Icons';
import ChangePassword from './ChangePassword';
export default {
  name: 'changePassword',
  label: 'generic.pages.changePassword',
  icon: ChangePasswordIcon,
  url: 'changePassword',
  screens: {
    main: ChangePassword,
  },
  resources: ['clientusers'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
