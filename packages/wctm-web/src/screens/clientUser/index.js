import { Create, Add } from '@material-ui/icons';
import { ClientIcon, ViewIcon, ExportIcon } from '../../styles/Icons';
import ListClientUser from './ListClientUser';

export default {
  name: 'clientUser',
  label: 'generic.pages.clientUser',
  icon: ClientIcon,
  url: 'clientusers',
  screens: {
    main: ListClientUser,
  },
  resources: ['clients', 'clientusers', 'geowards', 'geodistricts', 'geoquarters', 'geoprovinces'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientUsers', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.clientusers.view',
    },
    createAccountWithDefaultPassword: {
      apis: [{ url: '/ClientUsers/createAccountWithDefaultPassword', method: 'POST' }],
      icon: Add,
      label: 'resources.clientusers.add',
    },
    read: [],
    write: [],
  },
};
