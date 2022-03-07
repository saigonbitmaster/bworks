import commonFields from '../commomFields';
export default {
  name: 'Formula |||| Formula',
  fields: {
    name: 'Name',
    applyDate: 'Apply date',
    sewageFee: 'sewage fee (%)',
    tax: 'Tax (%)',
    unit: 'Unit',
    from: 'From (m³)',
    to: 'To (m³)',
    price: 'Price (VND/m³)',
    addNorm: 'Add price step',
    delNorm: 'Delete price step',
    normGroups: 'Price steps',
    ...commonFields,
  },
  noLimit: 'No limit',
  inputValGreater: 'Input greater value %{val}',
  // <Permission>
  view: 'View formula list',
  edit: 'Edit formula',
  create: 'Create new formula',
  delete: 'Delete formula',
  // </Permission>
};
