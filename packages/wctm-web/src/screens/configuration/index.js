import { Add, Create, Delete } from '@material-ui/icons';
import { ConfigurationIcon, ViewIcon } from '../../styles/Icons';
import ConfigurationList from '../../resources/configuration/ConfigurationList';
import ConfigurationCreate from '../../resources/configuration/ConfigurationCreate';
import ConfigurationEdit from '../../resources/configuration/ConfigurationEdit';
export default {
  name: 'Configuration',
  label: 'generic.pages.configuration',
  icon: ConfigurationIcon,
  url: 'configuration',
  screens: {
    list: ConfigurationList,
    create: ConfigurationCreate,
    edit: ConfigurationEdit,
  },
  resources: ['ctmconfigs'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/CtmConfigs', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.ctmconfigs.view',
    },
    edit: {
      apis: [
        { url: '/CtmConfigs/getAttributeChoices', method: 'get' },
        { url: '/CtmConfigs/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/CtmConfigs/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.ctmconfigs.edit',
    },
    delete: {
      apis: [{ url: '/CtmConfigs/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.ctmconfigs.delete',
    },
    create: {
      apis: [
        { url: '/CtmConfigs/getAttributeChoices', method: 'get' },
        { url: '/CtmConfigs/getUnusedChoices', method: 'get' },
        { url: '/CtmConfigs', method: 'post' },
      ],
      icon: Add,
      label: 'resources.ctmconfigs.create',
    },
    read: [],
    write: [],
  },
};
