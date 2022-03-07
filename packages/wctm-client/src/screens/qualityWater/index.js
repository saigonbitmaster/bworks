import { QualityWaterIcon } from '../../styles/Icons';
import QualityWater from './QualityWater';
export default {
  name: 'qualityWater',
  label: 'generic.pages.qualityWater',
  icon: QualityWaterIcon,
  url: 'qualityWater',
  screens: {
    main: QualityWater,
  },
  resources: ['customqualitywaters'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
