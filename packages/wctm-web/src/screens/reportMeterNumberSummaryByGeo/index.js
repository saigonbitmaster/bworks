import { ReportQuantityClientIcon } from '../../styles/Icons';
import ReportMeterNumberSummaryByGeo from './ReportMeterNumberSummaryByGeo';
export default {
  name: 'reportTermNumberSummaryGroupByGeo',
  label: 'generic.pages.reportTermNumberSummaryGroupByGeo',
  icon: ReportQuantityClientIcon,
  url: 'reportTermNumberSummaryGroupByGeo',
  screens: {
    main: ReportMeterNumberSummaryByGeo,
  },
  resources: ['clientmeternumbers'],
  active: true,
  access: {
    viewReportTermNumberSummaryGroupByGeo: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/ClientMeterNumbers/exportExcelTermNumberSummaryGroupByGeo', method: 'get' },
      ],
      icon: ReportQuantityClientIcon,
      label: 'generic.pages.reportTermNumberSummaryGroupByGeo',
    },
  },
};
