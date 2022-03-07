import commonFields from '../commomFields';
export default {
  fields: {
    title: 'Name',
    name: 'Keywords',
    slug: 'Slug',
    created: 'Created date',
    project: 'Project',
    ...commonFields,
  },
  // <Permission>
  view: 'View role list',
  edit: 'Edit role',
  delete: 'Delete role',
  create: 'Create new role',
  // </Permission>
};
