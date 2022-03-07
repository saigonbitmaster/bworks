import commonFields from '../commomFields';
export default {
  name: 'Material type |||| Material type',
  titleList: 'Material type',
  fields: {
    type: 'Material group',
    name: 'Material type name',
    id: 'Id',
    slug: 'Slug',
    searchType: 'Search material type name',
    ...commonFields,
  },
  createMatType: 'Add material type',
  editMatType: 'Edit material type',
  viewMatType: 'View material type',
  deleteMatType: 'Delete material type',
};
