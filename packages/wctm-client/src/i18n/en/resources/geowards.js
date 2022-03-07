import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'Fullname',
    code: 'Code',
    population: 'Population',
    countryId: 'Country',
    provinceId: 'Province',
    districtId: 'District',
    location: 'Location',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
};
