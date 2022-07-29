import { MatDetailTypeIcon } from '../../styles/Icons';
import List from '../../resources/jobtype/list';
import Create from '../../resources/jobtype/create';
import Edit from '../../resources/jobtype/edit';
import Show from '../../resources/jobtype/show';

import AdfScannerIcon from '@material-ui/icons/WorkOutline';


export default {
  name: 'jobType',
  label: 'generic.pages.jobType',
  icon: AdfScannerIcon,
  url: 'jobtype',
  screens: {
    list: List,
    create: Create,
    edit: Edit,
    show: Show,
  },
  resources: ['jobtypes'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
