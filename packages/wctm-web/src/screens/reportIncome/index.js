import { PictureAsPdf } from '@material-ui/icons';
import { ReportIncomeIcon, ViewIcon } from '../../styles/Icons';
import ReportIncome from './ReportIncome';
export default {
  name: 'reportIncome',
  label: 'generic.pages.reportIncome',
  icon: ReportIncomeIcon,
  url: 'reportIncome',
  screens: {
    main: ReportIncome,
  },
  resources: ['customreportincomes'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/reportIncome', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportincomes.view',
    },
    exportPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportincomes.exportPDF',
    },
  },
};
