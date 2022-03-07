import { Add, Create, Search } from '@material-ui/icons';
import { CtmTemplateIcon } from '../../styles/Icons';
import CtmTemplateList from '../../resources/ctmTemplate/CtmTemplateList';
import CtmTemplateCreate from '../../resources/ctmTemplate/CtmTemplateCreate';
import CtmTemplateEdit from '../../resources/ctmTemplate/CtmTemplateEdit';
// import CtmTemplateShow from '../../resources/ctmTemplate/CtmTemplateShow';

export default {
  name: 'CtmTemplate',
  label: 'generic.pages.ctmTemplate',
  icon: CtmTemplateIcon,
  url: 'ctmtemplate',
  screens: {
    list: CtmTemplateList,
    create: CtmTemplateCreate,
    edit: CtmTemplateEdit,
  },
  resources: ['ctmtemplates'],
  active: true,
  access: {
    // view: {
    //   apis: [{ url: '/CtmTemplates', method: 'get' }, { url: '/CtmTemplates/getId', method: 'get' }],
    //   icon: ViewIcon,
    //   label: 'resources.ctmtemplates.view',
    // },
    edit: {
      apis: [
        { url: '/CtmTemplates/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/CtmFiles/upload', method: 'post' },
        { url: '/CtmTemplates/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.ctmtemplates.edit',
    },
    create: {
      apis: [
        { url: '/CtmTemplates/getId', method: 'get' },
        { url: '/CtmFiles/upload', method: 'post' },
        { url: '/CtmTemplates', method: 'post' },
      ],
      icon: Add,
      label: 'resources.ctmtemplates.create',
    },
    examine: {
      apis: [{ url: '/CtmTemplates/{id}', method: 'get' }],
      icon: Search,
      label: 'resources.ctmtemplates.examine',
    },
    read: [],
    write: [],
  },
};
