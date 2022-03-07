import { AlertThresholdIcon } from '../../styles/Icons';
import ListAlertThreshold from '../../resources/alertthreshold/listAlertThreshold';
import CreateAlertThreshold from '../../resources/alertthreshold/createAlertThreshold';
import EditAlertThreshold from '../../resources/alertthreshold/editAlertThreshold';
import ShowAlertThreshold from '../../resources/alertthreshold/showAlertThreshold';

export default {
  name: 'AlertThreshold',
  label: 'generic.pages.alertthreshold',
  icon: AlertThresholdIcon,
  url: 'alertthreshold',
  screens: {
    list: ListAlertThreshold,
    create: CreateAlertThreshold,
    edit: EditAlertThreshold,
    show: ShowAlertThreshold,
  },
  resources: ['alertthresholds', 'waterparameters', 'watersources'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
