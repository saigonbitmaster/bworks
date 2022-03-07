import { InspectMeterNumberIcon } from '../../styles/Icons';
import InspectMeterNumberList from './InspectMeterNumberList';
import InspectMeterNumberEdit from './InspectMeterNumberEdit';

export default {
  name: 'inspectMeterNumber',
  icon: InspectMeterNumberIcon,
  url: 'inspectMeterNumber',
  label: 'generic.pages.inspectMeterNumber',
  resources: ['meternumbersubmits'],
  screens: {
    main: InspectMeterNumberList,
    edit: InspectMeterNumberEdit,
  },
  active: true,
  access: {},
};
