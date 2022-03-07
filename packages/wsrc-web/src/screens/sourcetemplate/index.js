import { SourceTemplateIcon } from '../../styles/Icons';
import SourceTemplateList from '../../resources/sourcetemplate/sourceTemplateList';
import SourceTemplateCreate from '../../resources/sourcetemplate/sourceTemplateCreate';
import SourceTemplateEdit from '../../resources/sourcetemplate/sourceTemplateEdit';
import SourceTemplateShow from '../../resources/sourcetemplate/sourceTemplateShow';
export default {
  name: 'SourceTemplate',
  label: 'generic.pages.sourceTemplate',
  icon: SourceTemplateIcon,
  url: 'sourcetemplate',
  screens: {
    list: SourceTemplateList,
    create: SourceTemplateCreate,
    edit: SourceTemplateEdit,
    show: SourceTemplateShow,
  },
  resources: ['sourcetemplates'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
