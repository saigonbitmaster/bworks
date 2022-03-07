import { InvoiceLockIcon, ListIcon } from '../../styles/Icons';
import InvoiceLockList from '../../resources/invoiceLock/InvoiceLockList';
export default {
  name: 'invoiceLock',
  label: 'generic.pages.invoiceLock',
  icon: InvoiceLockIcon,
  url: 'invoiceLock',
  screens: {
    list: InvoiceLockList,
  },
  resources: ['clients', 'clientmeternumbers', 'formulas'],
  active: true,
  access: {
    list: {
      apis: [
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/Clients', method: 'get' },
        { url: '/Clients/invoiceLockList', method: 'get' },
        { url: '/Formulas', method: 'get' },
      ],
      icon: ListIcon,
      label: 'resources.clientmeternumbers.permission.listClient',
    },
    lock: {
      apis: [{ url: '/ClientMeterNumbers/calculateInvoices', method: 'post' }],
      icon: InvoiceLockIcon,
      label: 'resources.clientmeternumbers.permission.lockInvoice',
    },
  },
};
