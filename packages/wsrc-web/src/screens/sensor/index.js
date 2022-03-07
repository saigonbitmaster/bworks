import { SensorIcon } from '../../styles/Icons';
import ListSensor from '../../resources/sensor/listSensor';
import CreateSensor from '../../resources/sensor/createSensor';
import EditSensor from '../../resources/sensor/editSensor';
import ShowSensor from '../../resources/sensor/showSensor';

export default {
  name: 'Sensor',
  label: 'generic.pages.sensor',
  icon: SensorIcon,
  url: 'sensor',
  screens: {
    list: ListSensor,
    create: CreateSensor,
    edit: EditSensor,
    show: ShowSensor,
  },
  resources: ['sensors', 'interfacestandards', 'waterparameters', 'dataloggers', 'waterparameters'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
