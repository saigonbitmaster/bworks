import { PumpStationIcon } from '../../styles/Icons';
import PumpStationList from './PumpStationList';
import PumpStationEdit from './PumpStationEdit';
import PumpStationCreate from './PumpStationCreate';

export default {
  name: 'PumpStation',
  label: 'generic.pages.pumpStation',
  icon: PumpStationIcon,
  url: 'PumpStation',
  screens: {
    list: PumpStationList,
    create: PumpStationCreate,
    edit: PumpStationEdit,
  },
  resources: ['pumpstations'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
