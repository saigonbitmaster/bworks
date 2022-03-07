import { HowToReg, Delete } from '@material-ui/icons';
import { ClientIcon, ViewIcon } from '../../styles/Icons';
import ListClientUserRequest from './ListClientUserRequest';

export default {
  name: 'clientUserRequest',
  label: 'generic.pages.clientUserRequest',
  icon: ClientIcon,
  url: 'clientuserrequests',
  screens: {
    main: ListClientUserRequest,
  },
  resources: ['clients', 'clientusers', 'geowards', 'geodistricts', 'geoquarters', 'geoprovinces'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/ClientUsers', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.clientusers.view',
    },
    approve: {
      apis: [{ url: '/ClientUsers/approveNewRequest', method: 'POST' }],
      icon: HowToReg,
      label: 'resources.clientusers.approve',
    },
    delete: {
      apis: [{ url: '/ClientUsers/{id}', method: 'DELETE' }],
      icon: Delete,
      label: 'resources.clientusers.delete',
    },
    read: [],
    write: [],
  },
};
