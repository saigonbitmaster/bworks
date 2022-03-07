import { PictureAsPdf } from '@material-ui/icons';
import { ReportRevenueLossWaterIcon, ViewIcon } from '../../styles/Icons';
import ReportRevenueLossWater from './ReportRevenueLossWater';
export default {
  name: 'reportRevenueLossWater',
  label: 'generic.pages.reportRevenueLossWater',
  icon: ReportRevenueLossWaterIcon,
  url: 'reportRevenueLossWater',
  screens: {
    main: ReportRevenueLossWater,
  },
  resources: ['customreportwaterlosses', 'customreportrevenuelosses'],
  active: true,
  access: {
    viewRevenueLoss: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/Clients/reportWaterLoss', method: 'get' },
        { url: '/Clients/reportRevenueLoss', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportrevenuelosswaters.revenueLoss.view',
    },
    viewWaterLoss: {
      apis: [{ url: '/Clients/reportWaterLoss', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.reportrevenuelosswaters.waterLoss.view',
    },
    exportRevenueLossAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportrevenuelosswaters.revenueLoss.exportPDF',
    },
    exportWaterLossAsPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportrevenuelosswaters.waterLoss.exportPDF',
    },
  },
};
