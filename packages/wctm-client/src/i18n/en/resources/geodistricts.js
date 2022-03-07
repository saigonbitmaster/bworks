import commonFields from '../commomFields';
export default {
  name: 'District |||| District',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'Fullname',
    code: 'Code',
    population: 'Population',
    countryId: 'Country',
    provinceId: 'Province / City',
    location: 'Location',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edir',
  show: 'Show',
};
