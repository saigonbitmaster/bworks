import { Add, Edit, Delete } from '@material-ui/icons';
import { ConfigurationIcon } from '../../styles/Icons';
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
  resources: ['nmsconfigs'],
  active: true,
  access: {
    create: {
      apis: [
        { url: '/NmsConfigs/getAttributeChoices', method: 'get' },
        { url: '/NmsConfigs/getUnusedChoices', method: 'get' },
        { url: '/NmsConfigs', method: 'post' },
        { url: '/NmsConfigs', method: 'get' },
      ],
      icon: Add,
      label: 'resources.nmsconfigs.create',
    },
    edit: {
      apis: [
        { url: '/NmsConfigs/getAttributeChoices', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/NmsConfigs', method: 'get' },
        { url: '/NmsConfigs/{id}', method: 'put' },
      ],
      icon: Edit,
      label: 'resources.nmsconfigs.edit',
    },
    delete: {
      apis: [
        { url: '/NmsConfigs', method: 'get' },
        { url: '/NmsConfigs/{id}', method: 'delete' },
      ],
      icon: Delete,
      label: 'resources.nmsconfigs.delete',
    },
  },
};
