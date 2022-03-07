import commonFields from '../commomFields';
export default {
  name: 'Position',
  fields: {
    name: 'Position name',
    position: 'Position',
    elevation: 'Heigh',
    ...commonFields,
  },
  position: 'Select position (*)',
};
