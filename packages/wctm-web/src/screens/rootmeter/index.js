import { Add, Create, Search, Delete } from '@material-ui/icons';
import { RootMeterIcon, ViewIcon } from '../../styles/Icons';
import ListRootMeter from '../../resources/rootmeter/listRootMeter';
import CreateRootMeter from '../../resources/rootmeter/createRootMeter';
import EditRootMeter from '../../resources/rootmeter/editRootMeter';
import ShowRootMeter from '../../resources/rootmeter/showRootMeter';

export default {
  name: 'RootMeter',
  label: 'generic.pages.rootMeter',
  icon: RootMeterIcon,
  url: 'rootmeter',
  screens: {
    list: ListRootMeter,
    create: CreateRootMeter,
    edit: EditRootMeter,
    show: ShowRootMeter,
  },
  resources: ['rootmeters', 'waterproviders'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/WaterProviders', method: 'get' },
        { url: '/RootMeters', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.rootmeters.view',
    },
    edit: {
      apis: [
        { url: '/RootMeters/{id}', method: 'get' },
        { url: '/WaterProviders', method: 'get' },
        { url: '/RootMeters/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.rootmeters.edit',
    },
    delete: {
      apis: [{ url: '/RootMeters/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.rootmeters.delete',
    },
    create: {
      apis: [
        { url: '/WaterProviders', method: 'get' },
        { url: '/RootMeters', method: 'post' },
      ],
      icon: Add,
      label: 'resources.rootmeters.create',
    },
    examine: {
      apis: [
        { url: '/RootMeters/{id}', method: 'get' },
        { url: '/WaterProviders', method: 'get' },
      ],
      icon: Search,
      label: 'resources.rootmeters.examine',
    },
    read: [],
    write: [],
  },
};
