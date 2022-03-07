import { Create } from '@material-ui/icons';
import { ClientIcon, ViewIcon, ExportIcon } from '../../styles/Icons';
import ListClient from './ListClient';
import EditClient from './EditClient';
export default {
  name: 'client',
  label: 'generic.pages.client',
  icon: ClientIcon,
  url: 'clients',
  screens: {
    main: ListClient,
    edit: EditClient,
  },
  resources: ['clients', 'waterproviders', 'dmas'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientRegisters', method: 'get' },
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
      label: 'resources.clients.view',
    },
    export: {
      apis: [{ url: '/ExcelUtils/exportExcelFile', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clients.export',
    },
    edit: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/WaterProviders', method: 'get' },
        { url: '/Dmas', method: 'get' },
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
        { url: '/WaterProviders/{id}', method: 'get' },
        { url: '/Dmas/{id}', method: 'get' },
        { url: '/Clients/editClient/{id}', method: 'put' },
        // { url: '/Clients/validateWithinRadius', method: 'get' },
      ],
      icon: Create,
      label: 'resources.clients.edit',
    },
    read: [],
    write: [],
  },
};
