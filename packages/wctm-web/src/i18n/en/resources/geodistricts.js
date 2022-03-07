import commonFields from '../commomFields';
export default {
  name: 'District |||| District',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'FullName',
    code: 'Code',
    population: 'Population',
    countryId: 'Country',
    provinceId: 'Province',
    position: 'Position',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View district list',
  delete: 'Delete district',
  examine: 'Show selected district',
  // </Permission>
};
