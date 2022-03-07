import { ReportFlowIcon } from '../../styles/Icons';
// import PdfView from '../../resources/reportflow/pdfView';
import Main from '../../resources/reportflow/Main';

export default {
  name: 'ReportFlow',
  label: 'generic.pages.reportflow',
  icon: ReportFlowIcon,
  url: 'reportflow',
  screens: {
    main: Main,
  },
  resources: ['reportflows', 'watersources'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
