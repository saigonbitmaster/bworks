import { InvoiceExport, ListIcon, PrintIcon, InvoicePaymentIcon, ExportIcon } from '../../styles/Icons';
import InvoiceExportList from '../../resources/invoiceExport/InvoiceExportList';
import { Visibility } from '@material-ui/icons';
export default {
  name: 'invoiceExport',
  label: 'generic.pages.invoiceExport',
  icon: InvoiceExport,
  url: 'invoiceExport',
  screens: {
    list: InvoiceExportList,
  },
  resources: ['clients', 'clientmeternumbers', 'formulas'],
  active: true,
  access: {
    list: {
      apis: [
        // { url: '/Clients', method: 'get' },
        // { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/ClientMeterNumbers/exportExcelByGeo', method: 'get' },
        { url: '/EInvoiceData/getLatestEinvoice', method: 'get' },
        { url: '/EInvoiceRanges', method: 'get' },
        { url: '/Clients/joinWithMeterNumber', method: 'get' },
      ],
      icon: ListIcon,
      label: 'resources.clientmeternumbers.permission.listInvoice',
    },
    printInvoice: {
      apis: [
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/ClientMeterNumbers/exportInvoices', method: 'get' },
        { url: '/PDFGetters/getPDF', method: 'get' },
      ],
      icon: PrintIcon,
      label: 'resources.clientmeternumbers.permission.printInvoice',
    },
    previewInvoice: {
      apis: [{ url: '/EInvoiceData/getEInvoiceDraftPreview', method: 'post' }],
      icon: Visibility,
      label: 'resources.clientmeternumbers.permission.previewInvoice',
    },
    payInvoice: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/ClientMeterNumbers/payInvoiceByAdmin', method: 'post' },
      ],
      icon: InvoicePaymentIcon,
      label: 'resources.clientmeternumbers.permission.payInvoice',
    },
    exportEinvoice: {
      apis: [
        { url: '/EInvoiceData/createNewEInvoice', method: 'post' },
        { url: '/EInvoiceData/downloadEinvoice', method: 'get' },
      ],
      icon: ExportIcon,
      label: 'resources.clientmeternumbers.permission.exportEinvoice',
    },
    exportExcel: {
      apis: [{ url: '/ClientMeterNumbers/exportExcelByGeo', method: 'get' }],
      icon: ExportIcon,
      label: 'resources.clientmeternumbers.permission.exportExcel',
    },
  },
};
