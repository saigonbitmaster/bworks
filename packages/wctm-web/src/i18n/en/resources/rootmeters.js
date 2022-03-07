import commonFields from '../commomFields';
export default {
  name: 'Root meter |||| Root meter',
  fields: {
    name: 'Meter name',
    size: 'Meter size',
    seri: 'Serial number',
    waterProviderId: 'Provider',
    description: 'Description',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View root meter list',
  examine: 'Show selected root meter',
  delete: 'Delete root meter',
  // </Permission>
};
