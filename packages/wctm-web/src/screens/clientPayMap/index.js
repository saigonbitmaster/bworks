import { ClientWritePayMapIcon } from '../../styles/Icons';
import ClientPayMap from './ClientPayMap';
export default {
  name: 'clientPayMap',
  label: 'generic.pages.clientPayMap',
  icon: ClientWritePayMapIcon,
  url: 'clientPayMap',
  screens: {
    main: ClientPayMap,
  },
  resources: ['clients', 'geodistricts', 'geowards', 'geoquarters', 'geoprovinces'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/CtmConfigs', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/getClientByPay', method: 'get' },
        { url: '/Clients/countClientByPay', method: 'get' },
      ],
    },
  },
};
