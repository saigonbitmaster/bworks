import commonFields from '../commomFields';
export default {
  name: 'Installation team |||| Installation team',
  fields: {
    name: 'Name',
    contactPersonId: 'Contact person',
    appUserIds: 'Members',
    providerId: 'Provider',
    description: 'Description',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View installation group list',
  delete: 'Delete installation group',
  examine: 'Show selected installation group',
  // </Permission>
};
