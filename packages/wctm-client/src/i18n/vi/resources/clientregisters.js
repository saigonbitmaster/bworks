import commonFields from '../commomFields';
import clients from './clients';
export default {
  name: 'Đăng kí |||| Đăng kí',
  fields: {
    ...clients.fields,
    ...commonFields,
  },
};
