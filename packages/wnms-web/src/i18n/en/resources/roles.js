import commonFields from '../commomFields';
export default {
  fields: {
    title: 'Name',
    name: 'Keyword',
    slug: 'Keyword',
    created: 'Created date',
    project: 'Project',
    ...commonFields,
  },
  // <Permission>
  view: 'View role',
  edit: 'Edit role',
  delete: 'Delete role',
  create: 'Create role',
  // </Permission>
};
