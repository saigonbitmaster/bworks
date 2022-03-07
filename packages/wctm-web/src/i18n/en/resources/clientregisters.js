import commonFields from '../commomFields';
import clients from './clients';
export default {
  name: 'Register |||| Register',
  fields: {
    ...clients.fields,
    ...commonFields,
  },
  view: 'View new client list',
  export: 'Export excel',
  contract: 'Sign contract',
  create: 'Create new client',
  edit: 'Edit new client',
};
