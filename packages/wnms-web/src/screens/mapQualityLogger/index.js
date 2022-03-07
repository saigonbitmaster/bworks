import { MapQualityLoggerIcon } from '../../styles/Icons';
import Main from './Main';
import SubQualityLogger from '../subQualityLogger/SubQualityLogger';
export default {
  name: 'MapQualityLogger',
  label: 'generic.pages.mapQualityLogger',
  icon: MapQualityLoggerIcon,
  url: 'mapQualityLogger',
  screens: {
    main: Main,
    subQualityLogger: { component: SubQualityLogger, subPath: ':id' },
  },
  access: {
    read: [],
    write: [],
  },
};
