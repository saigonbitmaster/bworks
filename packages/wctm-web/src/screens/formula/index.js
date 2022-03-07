import { Add, Create } from '@material-ui/icons';
import { FormulaIcon, DeleteIcon } from '../../styles/Icons';
import ListFormula from './ListFormula';
import CreateFormula from './CreateFormula';
import EditFormula from './EditFormula';
export default {
  name: 'formula',
  label: 'generic.pages.formula',
  icon: FormulaIcon,
  url: 'formula',
  screens: {
    main: ListFormula,
    create: CreateFormula,
    edit: EditFormula,
  },
  resources: ['formulas'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/Formulas', method: 'get' }],
      icon: FormulaIcon,
      label: 'resources.formulas.view',
    },
    edit: {
      apis: [
        { url: '/Formulas/{id}', method: 'get' },
        { url: '/Formulas/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.formulas.edit',
    },
    create: {
      apis: [{ url: '/Formulas', method: 'post' }],
      icon: Add,
      label: 'resources.formulas.create',
    },
    delete: {
      apis: [{ url: '/Formulas/{id}', method: 'delete' }],
      icon: DeleteIcon,
      label: 'resources.formulas.delete',
    },
    read: [],
    write: [],
  },
};
