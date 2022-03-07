import { PrintIcon } from '../../styles/Icons';
import printInvoice from './printInvoices';
export default {
  name: 'printInvoiceNotice',
  label: 'generic.printInvoiceNotice',
  icon: PrintIcon,
  url: 'printInvoice',
  screens: {
    main: printInvoice,
  },
  resources: ['clientmeternumbers'],
  active: true,
  access: {
    viewReportTermNumberGroupByGeo: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/ClientMeterNumbers/exportInvoiceNoticeGroupByGeo', method: 'get' },        
        { url: '/ClientMeterNumbers/exportExcelTermNumberGroupByGeo', method: 'get' },
      ],
      icon: PrintIcon,
      label: 'generic.printInvoiceNotice',
    },
  },
};
