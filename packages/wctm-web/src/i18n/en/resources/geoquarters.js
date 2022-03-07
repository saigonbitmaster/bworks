import commonFields from '../commomFields';
export default {
  name: 'Quarter |||| Quarter',
  fields: {
    name: 'Name',
    prefix: 'Prefix',
    fullName: 'FullName',
    code: 'Code',
    population: 'Population',
    countryId: 'Country',
    provinceId: 'Province',
    districtId: 'District',
    wardId: 'Ward',
    position: 'Position',
    radius: 'Radius',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View quarter list',
  delete: 'Delete quarter',
  examine: 'Show selected quarter',
  // </Permission>
};
