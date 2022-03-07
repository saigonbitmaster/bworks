import { PictureAsPdf } from '@material-ui/icons';
import { ReportQuantityClientIcon, ViewIcon } from '../../styles/Icons';
import ReportQuantityClient from './ReportQuantityClient';
export default {
  name: 'reportQuantityClient',
  label: 'generic.pages.reportQuantityClient',
  icon: ReportQuantityClientIcon,
  url: 'reportQuantityClient',
  screens: {
    main: ReportQuantityClient,
  },
  resources: ['customreportquantityclientbygeos', 'customreportquantityclientbyproviders'],
  active: true,
  access: {
    viewQuantityClientByGeo: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/reportQuantityClientByGeo', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportquantityclients.byGeo.view',
    },
    viewQuantityClientByProvider: {
      apis: [{ url: '/Clients/reportQuantityClientByProvider', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.reportquantityclients.byProvider.view',
    },
    exportQuantityClientByGeoAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportquantityclients.byGeo.exportPDF',
    },
    exportQuantityClientByProviderAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportquantityclients.byProvider.exportPDF',
    },
  },
};
