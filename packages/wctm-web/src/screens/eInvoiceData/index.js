import { EInvoiceDataIcon, ViewIcon } from '../../styles/Icons';
import { MenuIcon } from '@material-ui/icons';
import ListEInvoiceData from '../../resources/eInvoiceData/listEInvoiceData';
import ShowEInvoiceData from '../../resources/eInvoiceData/showEInvoiceData';
export default {
  name: 'EInvoiceData',
  label: 'generic.pages.eInvoiceData',
  icon: EInvoiceDataIcon,
  url: 'eInvoiceData',
  screens: {
    main: ListEInvoiceData,
    show: ShowEInvoiceData,
  },
  resources: ['einvoicedata'],
  active: true,
  access: {
    list: {
      apis: [{ url: '/EInvoiceData', method: 'get' }],
      icon: MenuIcon,
      label: 'resources.einvoicedata.list',
    },
    view: {
      apis: [{ url: '/EInvoiceData/{id}', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.einvoicedata.examine',
    },
  },
};
