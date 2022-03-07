import { ReportVolumeIcon } from '../../styles/Icons';
// import reportMain from '../../resources/reportvolume/reportMain';
import main from '../../resources/reportvolume/Main';
export default {
  name: 'ReportVolume',
  label: 'generic.pages.reportvolume',
  icon: ReportVolumeIcon,
  url: 'reportvolume',
  screens: {
    main: main,
  },
  resources: ['reportvolumes', 'watersources'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
