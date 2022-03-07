import commonFields from '../commomFields';
import clients from './clients';
export default {
  name: 'Đăng kí |||| Đăng kí',
  fields: {
    ...clients.fields,
    ...commonFields,
  },
  validation: {
    code: 'Mã KH phải là ký tự A->Z, chữ số 0->9 hoặc dấu gạch dưới',
    contractNo: 'Mã hợp đồng phải là ký tự A->Z, chữ số 0->9 hoặc dấu gạch dưới',
  },
  view: 'Xem danh sách Khách hàng mới',
  export: 'Xuất Excel',
  contract: 'Ký hợp đồng',
  create: 'Tạo khách hàng mới',
  edit: 'Sửa dữ liệu Khách hàng mới',
};
