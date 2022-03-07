import commonFields from '../commomFields';
export default {
  name: 'Template  |||| Template',
  fields: {
    id: 'Template code',
    createdDate: 'Created date',
    updatedDate: 'Update date',
    data: 'Attach file',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View template list',
  examine: 'Show selected template',
  // <Permission>
};
