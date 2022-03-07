import { WaterParameterIcon } from '../../styles/Icons';
import ListWaterParameter from '../../resources/waterparameter/listWaterParameter';
import CreateWaterParameter from '../../resources/waterparameter/createWaterParameter';
import EditWaterParameter from '../../resources/waterparameter/editWaterParameter';
import ShowWaterParameter from '../../resources/waterparameter/showWaterParameter';

export default {
  name: 'WaterParameter',
  label: 'generic.pages.waterParameter',
  icon: WaterParameterIcon,
  url: 'waterparameter',
  screens: {
    list: ListWaterParameter,
    create: CreateWaterParameter,
    edit: EditWaterParameter,
    show: ShowWaterParameter,
  },
  resources: ['waterparameters'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
