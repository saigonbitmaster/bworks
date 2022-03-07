import { ClientDistributionMapIcon } from '../../styles/Icons';
import ClientDistributionMap from './ClientDistributionMap';

export default {
  name: 'clientDistributionMap',
  label: 'generic.pages.clientDistributionMap',
  icon: ClientDistributionMapIcon,
  url: 'clientDistributionMap',
  screens: {
    main: ClientDistributionMap,
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
        { url: '/Clients/getClientByGeo', method: 'get' },
        { url: '/Clients/countClientStatusByGeo', method: 'get' },
      ],
    },
  },
};
