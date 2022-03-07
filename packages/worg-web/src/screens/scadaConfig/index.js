import { ScadaIcon } from '../../styles/Icons';
import ScadaConfigList from 'web-common/src/screens/scadaConfig/ScadaConfigList';
import ScadaConfigEdit from 'web-common/src/screens/scadaConfig/ScadaConfigEdit';
import ScadaConfigCreate from 'web-common/src/screens/scadaConfig/ScadaConfigCreate';

export default {
  name: 'ScadaConfigList',
  label: 'generic.pages.scadaConfigList',
  icon: ScadaIcon,
  url: 'scadaConfigList',
  screens: {
    main: { component: ScadaConfigList },
    create: { component: ScadaConfigCreate },
    edit: { component: ScadaConfigEdit },
  },
  resources: ['factories', 'iotdevices'],
  access: {
    read: [],
    write: [],
  },
};
