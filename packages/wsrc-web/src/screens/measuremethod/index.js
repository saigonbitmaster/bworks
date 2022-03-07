import { MeasureMethodIcon } from '../../styles/Icons';
import ListMeasureMethod from '../../resources/measuremethod/listMeasureMethod';
import CreateMeasureMethod from '../../resources/measuremethod/createMeasureMethod';
import EditMeasureMethod from '../../resources/measuremethod/editMeasureMethod';
import ShowMeasureMethod from '../../resources/measuremethod/showMeasureMethod';

export default {
  name: 'MeasureMethod',
  label: 'generic.pages.measureMethod',
  icon: MeasureMethodIcon,
  url: 'measuremethod',
  screens: {
    list: ListMeasureMethod,
    create: CreateMeasureMethod,
    edit: EditMeasureMethod,
    show: ShowMeasureMethod,
  },
  resources: ['measuremethods'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
