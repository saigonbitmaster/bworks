import { ReportMaterialIcon } from '../../styles/Icons';
import ReportMain from '../../resources/reportmaterial/reportMain';

export default {
  name: 'ReportMaterial',
  label: 'generic.pages.reportmaterial',
  icon: ReportMaterialIcon,
  url: 'reportmaterial',
  screens: {
    main: ReportMain,
  },
  resources: [
    'dmas',
    'customwaterflows',
    'customwaterpressures',
    'customwaterflowpressurelevel1s',
    'customwaterflowpressurelevel2s',
    'reportmaterials',
  ],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
