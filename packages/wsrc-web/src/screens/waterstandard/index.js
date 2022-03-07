import { WaterStandardIcon } from '../../styles/Icons';
import ListWaterStandard from './ListWaterStandard';
import CreateWaterStandard from './CreateWaterStandard';
import EditWaterStandard from './EditWaterStandard';
import ShowWaterStandard from './ShowWaterStandard';

export default {
  name: 'WaterStandard',
  label: 'generic.pages.waterStandard',
  icon: WaterStandardIcon,
  url: 'waterstandard',
  screens: {
    list: ListWaterStandard,
    create: CreateWaterStandard,
    edit: EditWaterStandard,
    show: ShowWaterStandard,
  },
  resources: ['waterstandards'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
