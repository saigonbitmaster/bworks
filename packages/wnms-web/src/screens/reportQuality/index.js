import { ReportQualityIcon } from '../../styles/Icons';
import Main from './Main';
export default {
  name: 'ReportQuality',
  label: 'generic.pages.reportquality',
  icon: ReportQualityIcon,
  url: 'reportquality',
  screens: {
    main: Main,
  },
  resources: ['reportqualities', 'dmas', 'alerthreshld', 'materialuses'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
