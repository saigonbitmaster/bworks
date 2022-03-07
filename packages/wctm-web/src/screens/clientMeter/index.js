import { Create } from '@material-ui/icons';
import { ListClientMeterIcon, ViewIcon, ExportIcon, HistoryIcon, ChangeClientMeterIcon } from '../../styles/Icons';
import ListClientMeter from './ListClientMeter';
import CreateClientMeter from './CreateClientMeter';
import EditClientMeter from './EditClientMeter';
import ChangeClientMeter from './ChangeClientMeter';
import ListClientMeterHistory from './ListClientMeterHistory';

export default {
  name: 'clientMeter',
  label: 'generic.pages.listClientMeters',
  icon: ListClientMeterIcon,
  url: 'clientMeter',
  screens: {
    main: ListClientMeter,
    setup: { component: CreateClientMeter, subPath: ':clientId' },
    update: { component: EditClientMeter, subPath: ':clientId' },
    histories: { component: ListClientMeterHistory, subPath: ':clientId' },
    changeClientMeter: { component: ChangeClientMeter, subPath: ':clientId' },
  },
  resources: [
    'clientaliasmeters',
    'clients',
    'clientmeterhistories',
    'clientmeters',
    'installationteams',
    'rootmeters',
  ],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeters', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.clientmeters.view',
    },
    export: {
      apis: [{ url: '/ExcelUtils/exportExcelFile', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clientmeters.export',
    },
    edit: {
      apis: [
        { url: '/Clients/{id}', method: 'get' },
        { url: '/ClientMeters/{id}', method: 'get' },
        { url: '/RootMeters', method: 'get' },
        { url: '/RootMeters/{id}', method: 'get' },
        { url: '/InstallationTeams', method: 'get' },
        { url: '/InstallationTeams/{id}', method: 'get' },
        { url: '/ClientMeters/{id}', method: 'put' },
        { url: '/ClientMeters/setupNewMeter', method: 'post' },
        { url: '/ClientMeters/editClientMeter/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.clientmeters.edit',
    },
    changeMeter: {
      apis: [{ url: '/ClientRequests/replaceMeterRequest', method: 'post' }],
      icon: ChangeClientMeterIcon,
      label: 'resources.clientmeters.change',
    },
    showHistory: {
      apis: [{ url: '/ClientMeterHistories', method: 'get' }],
      icon: HistoryIcon,
      label: 'resources.clientmeters.showHistory',
    },
    read: [],
    write: [],
  },
};
