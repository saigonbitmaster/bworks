import { Add, Edit, Delete } from '@material-ui/icons';
import { WaterMaintenanceIcon } from '../../styles/Icons';
import WaterMaintenanceList from './WaterMaintenanceList';
import WaterMaintenanceEdit from './WaterMaintenanceEdit';
import WaterMaintenanceCreate from './WaterMaintenanceCreate';

export default {
  name: 'WaterMaintenance',
  label: 'generic.pages.waterMaintenance',
  icon: WaterMaintenanceIcon,
  url: 'watermaintenance',
  screens: {
    list: WaterMaintenanceList,
    create: WaterMaintenanceCreate,
    edit: WaterMaintenanceEdit,
  },
  resources: ['watermaintenances', 'dmas'],

  access: {
    create: {
      apis: [
        { url: '/WaterMaintenances', method: 'post' },
        { url: '/WaterMaintenances', method: 'get' },
        { url: '/Dmas', method: 'get' },
      ],
      icon: Add,
      label: 'resources.watermaintenances.create',
    },
    edit: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/WaterMaintenances/{id}', method: 'get' },
        { url: '/WaterMaintenances/{id}', method: 'put' },
        { url: '/WaterMaintenances', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: Edit,
      label: 'resources.watermaintenances.edit',
    },
    delete: {
      apis: [
        { url: '/WaterMaintenances/{id}', method: 'delete' },
        { url: '/WaterMaintenances', method: 'get' },
        { url: '/Dmas', method: 'get' },
      ],
      icon: Delete,
      label: 'resources.watermaintenances.delete',
    },
  },
};
