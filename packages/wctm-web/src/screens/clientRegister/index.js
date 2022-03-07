import { Add, Create } from '@material-ui/icons';
import { ClientRegisterIcon, ViewIcon, ExportIcon, ClientContractIcon } from '../../styles/Icons';
import CreateClientContract from '../clientContract/CreateClientContract';
import ListClientRegister from './ListClientRegister';
import CreateClientRegister from './CreateClientRegister';
import EditClientRegister from './EditClientRegister';

export default {
  name: 'clientRegister',
  label: 'generic.pages.clientRegister',
  icon: ClientRegisterIcon,
  url: 'clientRegister',
  screens: {
    main: ListClientRegister,
    contract: CreateClientContract,
    create: CreateClientRegister,
    edit: EditClientRegister,
  },
  resources: ['clientregisters', 'clients'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/ClientRegisters', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.clientregisters.view',
    },
    export: {
      apis: [{ url: '/ExcelUtils/exportExcelFile', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clientregisters.export',
    },
    contract: {
      apis: [
        { url: '/Formulas', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/WaterProviders', method: 'get' },
        { url: '/Formulas/{id}', method: 'get' },
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
        { url: '/Clients/contractSign', method: 'post' },
      ],
      icon: ClientContractIcon,
      label: 'resources.clientregisters.contract',
    },
    create: {
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
        { url: '/CtmConfigs', method: 'get' },
        { url: '/ClientRegisters', method: 'post' },
        // { url: '/Clients/validateWithinRadius', method: 'get' },
      ],
      icon: Add,
      label: 'resources.clientregisters.create',
    },
    edit: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/ClientRegisters/{id}', method: 'get' },
        { url: '/ClientRegisters/{id}', method: 'put' },
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
        // { url: '/Clients/validateWithinRadius', method: 'get' },
      ],
      icon: Create,
      label: 'resources.clientregisters.edit',
    },
    read: [],
    write: [],
  },
};
