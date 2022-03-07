import { WaterSourceIcon } from '../../styles/Icons';
import ListWaterSource from './ListWaterSource';
import CreateWaterSource from './CreateWaterSource';
import EditWaterSource from './EditWaterSource';
import ShowWaterSource from './ShowWaterSource';

export default {
  name: 'WaterSource',
  label: 'generic.pages.watersource',
  icon: WaterSourceIcon,
  url: 'watersource',
  screens: {
    list: ListWaterSource,
    create: CreateWaterSource,
    edit: EditWaterSource,
    show: ShowWaterSource,
  },
  resources: ['watersources', 'watersourcegroups'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
