import commonFields from '../commomFields';
export default {
  name: 'Country |||| Country',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'FullName',
    code: 'Code',
    population: 'Population',
    position: 'Central location',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View country list',
  delete: 'Delete country',
  examine: 'View selected country',
  // </Permission>
};
