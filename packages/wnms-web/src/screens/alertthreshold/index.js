import { AlertThresholdIcon } from '../../styles/Icons';
import ListAlertThreshold from './listAlertThreshold';
import CreateAlertThreshold from './createAlertThreshold';
import EditAlertThreshold from './editAlertThreshold';

export default {
  name: 'AlertThreshold',
  label: 'generic.pages.alertthreshold',
  icon: AlertThresholdIcon,
  url: 'alertthreshold',
  screens: {
    list: ListAlertThreshold,
    create: CreateAlertThreshold,
    edit: EditAlertThreshold,
  },
  resources: ['nmsalertthresholds'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
