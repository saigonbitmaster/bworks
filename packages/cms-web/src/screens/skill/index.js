import { MatDetailTypeIcon } from '../../styles/Icons';
import List from '../../resources/skill/list';
import Create from '../../resources/skill/create';
import Edit from '../../resources/skill/edit';
import Show from '../../resources/skill/show';

export default {
  name: 'skill',
  label: 'generic.pages.skill',
  icon: MatDetailTypeIcon,
  url: 'skill',
  screens: {
    list: List,
    create: Create,
    edit: Edit,
    show: Show,
  },
  resources: ['skills'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
