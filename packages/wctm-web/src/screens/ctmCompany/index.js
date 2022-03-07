import { Add, Create, Search, Delete } from '@material-ui/icons';
import { CtmCompanyIcon, ActiveButtonIcon, ViewIcon } from '../../styles/Icons';
import CtmCompanyList from '../../resources/ctmCompany/CtmCompanyList';
import CtmCompanyCreate from '../../resources/ctmCompany/CtmCompanyCreate';
import CtmCompanyEdit from '../../resources/ctmCompany/CtmCompanyEdit';
import CtmCompanyShow from '../../resources/ctmCompany/CtmCompanyShow';

export default {
  name: 'CtmCompany',
  label: 'generic.pages.ctmCompany',
  icon: CtmCompanyIcon,
  url: 'ctmcompany',
  screens: {
    list: CtmCompanyList,
    create: CtmCompanyCreate,
    edit: CtmCompanyEdit,
    show: CtmCompanyShow,
  },
  resources: ['ctmcompanies', 'bankaccounts'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/CtmCompanies', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.ctmcompanies.view',
    },
    edit: {
      apis: [
        { url: '/CtmCompanies/{id}', method: 'get' },
        { url: '/CtmCompanies/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.ctmcompanies.edit',
    },
    delete: {
      apis: [{ url: '/CtmCompanies/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.ctmcompanies.delete',
    },
    create: {
      apis: [{ url: '/CtmCompanies', method: 'post' }],
      icon: Add,
      label: 'resources.ctmcompanies.create',
    },
    examine: {
      apis: [{ url: '/CtmCompanies/{id}', method: 'get' }],
      icon: Search,
      label: 'resources.ctmcompanies.examine',
    },
    activate: {
      apis: [{ url: '/CtmCompanies/doActive', method: 'post' }],
      icon: ActiveButtonIcon,
      label: 'resources.ctmcompanies.activate',
    },
    read: [],
    write: [],
  },
};
