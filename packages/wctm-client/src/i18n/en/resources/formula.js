import commonFields from '../commomFields';
export default {
  name: 'Billing formula |||| Billing formula',
  fields: {
    name: 'Name',
    applyDate: 'Apply date',
    sewageFee: 'Sewage fee (%)',
    tax: 'Tax (%)',
    unit: 'Unit',
    from: 'From (m³)',
    to: 'To (m³)',
    price: 'Price (Usd/m³)',
    addNorm: 'Add price step',
    delNorm: 'Delete price step',
    normGroups: 'Step',
    ...commonFields,
  },
  noLimit: 'Unlimit',
  inputValGreater: 'Input the value greater %{val}',
};
