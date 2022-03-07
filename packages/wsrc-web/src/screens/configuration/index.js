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
  resources: ['srcconfigs'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
