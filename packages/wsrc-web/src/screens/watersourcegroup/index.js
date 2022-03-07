import { WaterSourceGroupIcon } from '../../styles/Icons';
import ListWaterSourceGroup from './ListWaterSourceGroup';
import CreateWaterSourceGroup from './CreateWaterSourceGroup';
import EditWaterSourceGroup from './EditWaterSourceGroup';
import ShowWaterSourceGroup from './ShowWaterSourceGroup';

export default {
  name: 'WaterSourceGroup',
  label: 'generic.pages.watersourcegroup',
  icon: WaterSourceGroupIcon,
  url: 'watersourcegroup',
  screens: {
    list: ListWaterSourceGroup,
    create: CreateWaterSourceGroup,
    edit: EditWaterSourceGroup,
    show: ShowWaterSourceGroup,
  },
  resources: ['watersourcegroups', 'watersourcegroupgroups'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
