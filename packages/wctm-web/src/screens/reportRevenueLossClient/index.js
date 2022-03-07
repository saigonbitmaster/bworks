import { PictureAsPdf } from '@material-ui/icons';
import { ReportRevenueLossClientIcon, ViewIcon } from '../../styles/Icons';
import ReportRevenueLossClient from './ReportRevenueLossClient';
export default {
  name: 'reportRevenueLossClient',
  label: 'generic.pages.reportRevenueLossClient',
  icon: ReportRevenueLossClientIcon,
  url: 'reportRevenueLossClient',
  screens: {
    main: ReportRevenueLossClient,
  },
  resources: ['customreportrevenueslossclients'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients/reportRevenueLossClient', method: 'get' },
        { url: '/Clients/totalReportRevenueLossClient', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportrevenuelossclients.view',
    },
    exportPDF: {
      apis: [{ url: '/CtmReports/exportReport', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportrevenuelossclients.exportPDF',
    },
  },
};
