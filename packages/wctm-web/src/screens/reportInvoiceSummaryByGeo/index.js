import { ReportQuantityClientIcon } from '../../styles/Icons';
import ReportMeterNumberByGeo from './ReportInvoiceSummaryByGeo';
export default {
  name: 'reportInvoiceSummaryGroupByGeo',
  label: 'generic.pages.reportInvoiceSummaryGroupByGeo',
  icon: ReportQuantityClientIcon,
  url: 'reportInvoiceSummaryGroupByGeo',
  screens: {
    main: ReportMeterNumberByGeo,
  },
  resources: ['clientmeternumbers'],
  active: true,
  access: {
    viewReportInvoiceSummaryGroupByGeo: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/ClientMeterNumbers/exportExcelInvoiceSummaryGroupByGeo', method: 'get' },
      ],
      icon: ReportQuantityClientIcon,
      label: 'generic.pages.reportInvoiceSummaryGroupByGeo',
    },
  },
};
