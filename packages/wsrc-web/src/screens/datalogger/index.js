import { DataLoggerIcon } from '../../styles/Icons';
import ListDataLogger from '../../resources/datalogger/listDataLogger';
import CreateDataLogger from '../../resources/datalogger/createDataLogger';
import EditDataLogger from '../../resources/datalogger/editDataLogger';
import ShowDataLogger from '../../resources/datalogger/showDataLogger';

export default {
  name: 'DataLogger',
  label: 'generic.pages.datalogger',
  icon: DataLoggerIcon,
  url: 'datalogger',
  screens: {
    list: ListDataLogger,
    create: CreateDataLogger,
    edit: EditDataLogger,
    show: ShowDataLogger,
  },
  resources: ['dataloggers'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
