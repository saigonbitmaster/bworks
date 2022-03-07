import { ReportQualityIcon } from '../../styles/Icons';
// import ReportMain from '../../resources/reportquality/reportMain';
import main from '../../resources/reportquality/Main';
export default {
  name: 'ReportQuality',
  label: 'generic.pages.reportquality',
  icon: ReportQualityIcon,
  url: 'reportquality',
  screens: {
    main: main,
  },
  resources: ['reportqualities', 'watersources', 'alerthreshld', 'dataloggers'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
