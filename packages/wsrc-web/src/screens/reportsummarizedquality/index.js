import { ReportSummarizedQualityIcon } from '../../styles/Icons';
// import ReportMain from '../../resources/reportsummarizedquality/reportMain';
import main from '../../resources/reportsummarizedquality/Main';
export default {
  name: 'ReportSummarizedSummarizedQuality',
  label: 'generic.pages.reportsummarizedquality',
  icon: ReportSummarizedQualityIcon,
  url: 'reportsummarizedquality',
  screens: {
    main: main,
  },
  resources: [
    'dailywaterqualities',
    'reportsummarizedqualities',
    'watersources',
    'customwaterflowpressurelevel1s',
    'customwaterflowpressurelevel2s',
  ],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
