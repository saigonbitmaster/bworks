import commonFields from '../commomFields';
export default {
  name: 'Store invoice |||| Store invoice',
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
    nameQuarter: 'Name quarter',
    countExportedInvoice: 'Count exported invoice',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
};
