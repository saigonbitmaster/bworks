import commonFields from '../commomFields';
import clients from './clients';
export default {
  name: 'Submit |||| Submit',
  fields: {
    ...clients.fields,
    ...commonFields,
  },
};
