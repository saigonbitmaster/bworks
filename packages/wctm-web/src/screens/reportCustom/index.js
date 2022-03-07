import { ViewHeadlineIcon } from '../../styles/Icons';
import ReportMeterNumberByGeo from './reportCustom';
export default {
  name: 'reportCustom',
  label: 'generic.pages.reportCustom',
  icon: ViewHeadlineIcon,
  url: 'reportCustom',
  screens: {
    main: ReportMeterNumberByGeo,
  },
  resources: ['clientmeternumbers'],
  active: true,
  access: {
    viewReportCustom: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/ClientMeterNumbers/exportExcelTermNumberGroupByGeo', method: 'get' },
      ],
      icon: ViewHeadlineIcon,
      label: 'generic.pages.reportCustom',
    },
  },
};