import { Edit, Delete } from '@material-ui/icons';
import { InputKmlIcon, ImportKmlIcon } from '../../styles/Icons';
import Main from './Main';
import CreateKml from './CreateKml';
import EditKml from './EditKml';
export default {
  name: 'InputKml',
  label: 'generic.pages.inputKml',
  url: 'inputKml',
  icon: InputKmlIcon,
  screens: {
    main: Main,
    create: CreateKml,
    edit: EditKml,
  },
  resources: ['kmls'],
  access: {
    import: {
      apis: [
        { url: '/NmsFiles/uploadPublic', method: 'post' },
        { url: '/Kmls', method: 'post' },
        { url: '/Kmls', method: 'get' },
      ],
      icon: ImportKmlIcon,
      label: 'resources.kmls.import',
    },
    edit: {
      apis: [
        { url: '/Kmls/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Kmls/{id}', method: 'put' },
        { url: '/Kmls', method: 'get' },
      ],
      icon: Edit,
      label: 'resources.kmls.edit',
    },
    delete: {
      apis: [
        { url: '/Kmls/deleteKml', method: 'get' },
        { url: '/Kmls', method: 'get' },
      ],
      icon: Delete,
      label: 'resources.kmls.delete',
    },
  },
};
