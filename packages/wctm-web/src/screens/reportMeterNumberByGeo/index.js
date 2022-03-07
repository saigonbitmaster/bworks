import { ReportQuantityClientIcon } from '../../styles/Icons';
import ReportMeterNumberByGeo from './ReportMeterNumberByGeo';
export default {
  name: 'reportTermNumberGroupByGeo',
  label: 'generic.pages.reportTermNumberGroupByGeo',
  icon: ReportQuantityClientIcon,
  url: 'reportTermNumberGroupByGeo',
  screens: {
    main: ReportMeterNumberByGeo,
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
        { url: '/ClientMeterNumbers/exportExcelTermNumberGroupByGeo', method: 'get' },
      ],
      icon: ReportQuantityClientIcon,
      label: 'generic.pages.reportTermNumberGroupByGeo',
    },
  },
};
