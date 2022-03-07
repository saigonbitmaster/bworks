import { PressureIcon } from '../../styles/Icons';
import Pressure from './Pressure';
export default {
  name: 'pressure',
  label: 'generic.pages.pressure',
  icon: PressureIcon,
  url: 'pressure',
  screens: {
    main: Pressure,
  },
  resources: ['custompressures'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
