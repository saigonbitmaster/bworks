import { ClientRequestIcon, ViewIcon, ExportIcon, HistoryIcon, CompleteIcon } from '../../styles/Icons';
import ListClientRequest from './ListClientRequest';
import ListClientRequestHistory from './ListClientRequestHistory';
import EditClientRequest from './EditClientRequest';
export default {
  name: 'clientRequest',
  label: 'generic.pages.clientRequest',
  icon: ClientRequestIcon,
  url: 'clientRequest',
  screens: {
    main: ListClientRequest,
    histories: { component: ListClientRequestHistory, subPath: ':clientId' },
    edit: EditClientRequest,
  },
  resources: ['clientaliasclientrequests', 'clientrequests'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientRequests', method: 'get' },
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
      label: 'resources.clientrequests.view',
    },
    export: {
      apis: [{ url: '/ExcelUtils/exportExcelFile', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clientrequests.export',
    },
    completeRequest: {
      apis: [
        { url: '/Clients/{id}', method: 'get' },
        { url: '/Clients', method: 'get' },
        { url: '/InstallationTeams/{id}', method: 'get' },
        { url: '/InstallationTeams', method: 'get' },
        { url: '/ClientRequests/{id}', method: 'get' },
        { url: '/ClientRequests/{id}/client', method: 'get' },
        { url: '/ClientRequests/completeRequest', method: 'post' },
      ],
      icon: CompleteIcon,
      label: 'resources.clientrequests.completeRequest',
    },
    showHistory: {
      apis: [
        { url: '/ClientRequests', method: 'get' },
        { url: '/Clients', method: 'get' },
      ],
      icon: HistoryIcon,
      label: 'resources.clientrequests.showHistory',
    },
    read: [],
    write: [],
  },
};
