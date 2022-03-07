import { GisDesignIcon } from '../../styles/Icons';
import GisDesign from './GisDesign';

export default {
  name: 'GisDesign',
  label: 'generic.pages.gisdesign',
  icon: GisDesignIcon,
  url: 'gisdesign',
  screens: {
    main: { component: GisDesign },
  },
  resources: ['factories'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
