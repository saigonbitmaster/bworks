import { ReportQualityIcon } from '../../styles/Icons';
import SubQualityLogger from './SubQualityLogger';
export default {
  name: 'SubQualityLogger',
  label: 'generic.pages.reportquality',
  icon: ReportQualityIcon,
  url: 'subQualityLogger/:id',
  screens: {
    main: { component: SubQualityLogger },
  },
  resources: ['reportqualities', 'dmas', 'alerthreshld', 'materialuses'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
