import { InfoWaterUsageIcon } from '../../styles/Icons';
import InfoWaterUsage from './InfoWaterUsage';
export default {
  name: 'infoWaterUsage',
  label: 'generic.pages.infoWaterUsage',
  icon: InfoWaterUsageIcon,
  url: '',
  screens: {
    main: InfoWaterUsage,
  },
  resources: ['custominfowaterusages'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
