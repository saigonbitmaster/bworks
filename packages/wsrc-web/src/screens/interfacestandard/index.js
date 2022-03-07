import { InterfaceStandardIcon } from '../../styles/Icons';
import ListInterfaceStandard from '../../resources/interfacestandard/listInterfaceStandard';
import CreateInterfaceStandard from '../../resources/interfacestandard/createInterfaceStandard';
import EditInterfaceStandard from '../../resources/interfacestandard/editInterfaceStandard';
import ShowInterfaceStandard from '../../resources/interfacestandard/showInterfaceStandard';

export default {
  name: 'InterfaceStandard',
  label: 'generic.pages.interfacestandard',
  icon: InterfaceStandardIcon,
  url: 'interfacestandard',
  screens: {
    list: ListInterfaceStandard,
    create: CreateInterfaceStandard,
    edit: EditInterfaceStandard,
    show: ShowInterfaceStandard,
  },
  resources: ['interfacestandards'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
