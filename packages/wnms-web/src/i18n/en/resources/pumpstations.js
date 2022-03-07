import commonFields from '../commomFields';
export default {
  name: 'Pump Station',
  fields: {
    name: 'Name',
    designCapacity: 'Current Electric Capacity (kw/m3)',
    designElectricCapacity: 'Design Electric Capacity (kw/m3)',
    factoryId: 'Factory',
    designElectricRate: 'Design Electric Rate',
    ...commonFields,
  },
  edit: 'Edit',
  delete: 'Delete',
};
