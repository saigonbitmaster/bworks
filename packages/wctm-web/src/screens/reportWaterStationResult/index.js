import { PictureAsPdf, CloudDownload } from '@material-ui/icons';
import { WaterStationIcon, ViewIcon } from '../../styles/Icons';
import ReportWaterStationResult from './ReportWaterStationResult';
export default {
  name: 'reportWaterStationReport',
  label: 'generic.pages.reportWaterStationReport',
  icon: WaterStationIcon,
  url: 'reportWaterStationResult',
  screens: {
    main: ReportWaterStationResult,
  },
  active: true,
  access: {
    view: {
      apis: [
        { url: '/ExcelUtils/getWaterStationData', method: 'get' },
        { url: '/GeoWards/validateExistenceOfGeoGroupSchema', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.reportwaterstations.view',
    },
    exportPDF: {
      apis: [{ url: '/CtmTemplates/exportWaterStationReportResult', method: 'get' }],
      icon: PictureAsPdf,
      label: 'resources.reportwaterstations.exportPDF',
    },
    exportExcel: {
      apis: [{ url: '/ExcelUtils/exportWaterStationReport', method: 'get' }],
      icon: CloudDownload,
      label: 'resources.reportwaterstations.exportExcel',
    },
  },
};
