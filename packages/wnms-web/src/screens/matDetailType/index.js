import { Edit, Add, Delete } from '@material-ui/icons';
import { MatDetailTypeIcon } from '../../styles/Icons';
import CreateMatType from './CreateMatType';
import EditMatType from './EditMatType';
import ListMatType from './ListMatType';
export default {
  name: 'MatDetailType',
  label: 'generic.pages.matDetailType',
  icon: MatDetailTypeIcon,
  url: 'materialDetailType',
  screens: {
    main: ListMatType,
    create: CreateMatType,
    edit: EditMatType,
  },
  resources: ['materialdetailtypes'],
  active: true,
  access: {
    create: {
      apis: [
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialDetailTypes/customCreate', method: 'post' },
      ],
      icon: Add,
      label: 'resources.materialdetailtypes.createMatType',
    },
    edit: {
      apis: [
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialDetailTypes/{id}', method: 'get' },
        { url: '/MaterialDetailTypes/customEdit/{id}', method: 'put' },
      ],
      icon: Edit,
      label: 'resources.materialdetailtypes.editMatType',
    },
    delete: {
      apis: [
        { url: '/MaterialDetailTypes', method: 'get' },
        { url: '/MaterialDetailTypes/customDelete', method: 'get' },
      ],
      icon: Delete,
      label: 'resources.materialdetailtypes.deleteMatType',
    },
  },
};
