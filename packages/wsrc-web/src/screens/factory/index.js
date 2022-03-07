import { FactoryIcon } from '../../styles/Icons';
import ListFactory from '../../resources/factory/listFactory';
import CreateFactory from '../../resources/factory/createFactory';
import EditFactory from '../../resources/factory/editFactory';
import ShowFactory from '../../resources/factory/showFactory';

export default {
  name: 'Factory',
  label: 'generic.pages.factory',
  icon: FactoryIcon,
  url: 'Factory',
  screens: {
    list: ListFactory,
    create: CreateFactory,
    edit: EditFactory,
    show: ShowFactory,
  },
  resources: ['factories'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
