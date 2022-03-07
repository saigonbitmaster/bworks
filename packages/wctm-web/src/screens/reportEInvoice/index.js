import { EInvoiceReportIcon } from '../../styles/Icons';
import ReportMain from './reportMain';
export default {
  name: 'reportEInvoice',
  label: 'generic.pages.einvoicereport',
  icon: EInvoiceReportIcon,
  url: 'reportEInvoice',
  screens: {
    main: ReportMain,
  },
  resources: ['einvoicereports', "EInvoiceDatas"],
  active: true,
  access: {
    view: {
      apis: [{ url: '/EInvoiceData/eInvoiceReport', method: 'get' }, { url: '/EInvoiceData/eInvoiceReportSummary', method: 'get' }],
    },
  },
};
