import { Create } from '@material-ui/icons';
import { ClientContractIcon, ViewIcon, ExportIcon } from '../../styles/Icons';
import ListClientContract from './ListClientContract';
import EditClientContract from './EditClientContract';

export default {
  name: 'clientContract',
  label: 'generic.pages.clientContract',
  icon: ClientContractIcon,
  url: 'clientContract',
  screens: {
    main: ListClientContract,
    // create: CreateClientContract,
    edit: EditClientContract,
  },
  resources: [
    'clientregisters',
    'clients',
    'waterproviders',
    'dmas',
    'geodistricts',
    'geowards',
    'geoquarters',
    'geoprovinces',
    'formulas',
  ],
  active: true,
  access: {
    view: {
      apis: [{ url: '/Clients', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.clientcontracts.view',
    },
    export: {
      apis: [
        { url: '/ExcelUtils/exportExcelFile', method: 'get' },
        { url: '/Clients', method: 'get' },
      ],
      icon: ExportIcon,
      label: 'resources.clientcontracts.export',
    },
    edit: {
      apis: [
        { url: '/Formulas', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/Formulas/{id}', method: 'get' },
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
        { url: '/Clients/editClient/{id}', method: 'put' },
        { url: '/Clients/{id}', method: 'get' },
      ],
      icon: Create,
      label: 'resources.clientcontracts.edit',
    },
    read: [],
    write: [],
  },
};
