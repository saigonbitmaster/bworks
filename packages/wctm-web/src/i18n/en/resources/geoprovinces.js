import commonFields from '../commomFields';
export default {
  name: 'Province/city |||| Province/city',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'FullName',
    code: 'Code',
    population: 'population',
    countryId: 'Country',
    position: 'Position',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View province/city list',
  delete: 'Delete province/city',
  examine: 'Show selected province/city',
  // </Permission>
};
