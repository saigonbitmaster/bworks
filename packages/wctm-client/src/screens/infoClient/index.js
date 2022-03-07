import { InfoClientIcon } from '../../styles/Icons';
import InfoClient from './InfoClient';
export default {
  name: 'infoClient',
  label: 'generic.pages.infoClient',
  icon: InfoClientIcon,
  url: 'infoClient',
  screens: {
    main: InfoClient,
  },
  resources: ['clients'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
