import { PictureAsPdf } from '@material-ui/icons';
import { ReportClientMeterIcon, ViewIcon } from '../../styles/Icons';
import ReportClientMeter from './reportClientMeter';
export default {
  name: 'reportClientMeter',
  label: 'generic.pages.reportClientMeter',
  icon: ReportClientMeterIcon,
  url: 'reportClientMeter',
  screens: {
    main: ReportClientMeter,
  },
  resources: ['customreportclientmeters'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/reportClientMeter', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportclientmeters.view',
    },
    exportPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportclientmeters.exportPDF',
    },
  },
};
