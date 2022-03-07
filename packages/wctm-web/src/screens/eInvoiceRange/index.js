import { EInvoiceDataIcon, ViewIcon } from '../../styles/Icons';
import { Add, Create, Delete } from '@material-ui/icons';
import ListEInvoiceRange from './ListEInvoiceRange';
import CreateEInvoiceRange from './CreateEInvoiceRange';
import EditEInvoiceRange from './EditEInvoiceRange';
import ShowEInvoiceRange from './ShowEInvoiceRange';

export default {
  name: 'EInvoiceRange',
  label: 'generic.pages.eInvoiceRange',
  icon: EInvoiceDataIcon,
  url: 'einvoiceranges',
  screens: {
    main: ListEInvoiceRange,
    create: CreateEInvoiceRange,
    show: ShowEInvoiceRange,
    edit: EditEInvoiceRange,
  },
  resources: ['einvoiceranges'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/EInvoiceRanges', method: 'get' }],
      icon: ViewIcon,
      label: 'ra.action.list',
    },
    create: {
      apis: [{ url: '/EInvoiceRanges', method: 'post' }],
      icon: Add,
      label: 'ra.action.create',
    },
    edit: {
      apis: [{ url: '/EInvoiceRanges/{id}', method: 'put' }],
      icon: Create,
      label: 'ra.action.edit',
    },
    delete: {
      apis: [{ url: '/EInvoiceRanges/{id}', method: 'delete' }],
      icon: Delete,
      label: 'ra.action.delete',
    },
    examine: {
      apis: [{ url: '/EInvoiceRanges/{id}', method: 'get' }],
      icon: ViewIcon,
      label: 'ra.action.show',
    },
  },
};
