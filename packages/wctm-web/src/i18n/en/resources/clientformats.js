import commonFields from '../commomFields';
export default {
  fields: {
    name: 'Template name',
    model: 'Model',
    ...commonFields,
  },
  // <Permission>
  view: 'Show client information import screen',
  import: 'Import client information',
  exportTemplate: 'Export to Excel',
  // </Permission>
};
