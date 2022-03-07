import { InvoiceHistory, ListIcon, ViewIcon } from '../../styles/Icons';
import List from '../../resources/invoiceHistory/InvoiceHistoryList';
import InvoiceDataList from '../../resources/invoiceHistory/InvoiceDataList';
export default {
  name: 'invoiceHistory',
  label: 'generic.pages.invoiceHistory',
  icon: InvoiceHistory,
  url: 'invoiceHistory',
  screens: {
    list: List,
    invoiceData: { component: InvoiceDataList, subPath: ':id' },
  },
  resources: ['clientaliasinvoicehistories', 'clientmeternumbers', 'formulas'],
  active: true,
  access: {
    list: {
      apis: [{ url: '/Clients', method: 'get' }],
      icon: ListIcon,
      label: 'resources.clientmeternumbers.permission.listInvoice',
    },
    historyInvoice: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeterNumbers', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.clientmeternumbers.permission.historyInvoice',
    },
  },
};
