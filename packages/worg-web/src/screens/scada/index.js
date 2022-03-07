import { ScadaIcon } from '../../styles/Icons';
import ScadaList from './ScadaList';
import ScadaDetails from './ScadaDetails';

export default {
  name: 'ScadaList',
  label: 'generic.pages.scada',
  icon: ScadaIcon,
  url: 'scada',
  screens: {
    main: { component: ScadaList },
    scadadetails: { component: ScadaDetails, subPath: ':id' },
  },
  resources: ['factories'],
  access: {
    read: [],
    write: [],
  },
};
