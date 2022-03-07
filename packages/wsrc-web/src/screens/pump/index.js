import { PumpIcon } from '../../styles/Icons';
import ListPump from '../../resources/pump/listPump';
import CreatePump from '../../resources/pump/createPump';
import EditPump from '../../resources/pump/editPump';
import ShowPump from '../../resources/pump/showPump';

export default {
  name: 'Pump',
  label: 'generic.pages.pump',
  icon: PumpIcon,
  url: 'pump',
  screens: {
    list: ListPump,
    create: CreatePump,
    edit: EditPump,
    show: ShowPump,
  },
  resources: ['pumps'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
