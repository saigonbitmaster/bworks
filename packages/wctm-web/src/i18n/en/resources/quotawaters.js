import commonFields from '../commomFields';
export default {
  name: 'Water quota |||| Water quota',
  fields: {
    name: 'Name',
    _id: 'Quota code',
    value: 'Value',
    description: 'Description',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View quota list',
  examine: 'Show selected quota',
  // </Permission>
};
