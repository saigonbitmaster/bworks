import commonFields from '../commomFields';
export default {
  name: 'Ward |||| Ward',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'FullName',
    code: 'Code',
    population: 'Population',
    countryId: 'Country',
    provinceId: 'Province/city',
    districtId: 'District',
    position: 'Position',
    radius: 'Radius',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View ward list',
  delete: 'Delete ward',
  examine: 'Show selected ward',
  // </Permission>
};
