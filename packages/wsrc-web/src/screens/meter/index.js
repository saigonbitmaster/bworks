import { MeterIcon } from '../../styles/Icons';
import ListMeter from '../../resources/meter/listMeter';
import CreateMeter from '../../resources/meter/createMeter';
import EditMeter from '../../resources/meter/editMeter';
import ShowMeter from '../../resources/meter/showMeter';

export default {
  name: 'Meter',
  label: 'generic.pages.meter',
  icon: MeterIcon,
  url: 'meter',
  screens: {
    list: ListMeter,
    create: CreateMeter,
    edit: EditMeter,
    show: ShowMeter,
  },
  resources: ['meters'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
