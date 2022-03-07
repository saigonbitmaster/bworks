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
    provinceId: 'Province/city',
    districtId: 'District',
    wardId: 'Ward',
    location: 'Location',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edir',
  show: 'Show',
};
