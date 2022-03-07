import { PictureAsPdf } from '@material-ui/icons';
import { ReportDebtClientIcon, ViewIcon } from '../../styles/Icons';
import ReportDebtClient from './ReportDebtClient';
export default {
  name: 'reportDebtClient',
  label: 'generic.pages.reportDebtClient',
  icon: ReportDebtClientIcon,
  url: 'reportDebtClient',
  screens: {
    main: ReportDebtClient,
  },
  resources: ['customreportdebtclientbygeos', 'customreportdebtclientbyproviders'],
  active: true,
  access: {
    viewDebtClientByGeo: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/reportDebtClientByGeo', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportdebtclients.byGeo.view',
    },
    viewDebtClientByProvider: {
      apis: [{ url: '/Clients/reportDebtClientByProvider', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.reportdebtclients.byGeo.view',
    },
    exportDebtClientByGeoAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportdebtclients.byGeo.exportPDF',
    },
    exportDebtClientByProviderAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportdebtclients.byProvider.exportPDF',
    },
  },
};
