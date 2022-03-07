import { ClientWritePayMapIcon } from '../../styles/Icons';
import ClientWriteMap from './ClientWriteMap';
export default {
  name: 'clientWriteMap',
  label: 'generic.pages.clientWriteMap',
  icon: ClientWritePayMapIcon,
  url: 'clientWriteMap',
  screens: {
    main: ClientWriteMap,
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
        { url: '/Clients/getClientByWrite', method: 'get' },
        { url: '/Clients/countClientByWrite', method: 'get' },
      ],
    },
  },
};
