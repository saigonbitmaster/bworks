import commonFields from '../commomFields';
export default {
  name: 'Khách hàng |||| Khách hàng',
  fields: {
    name: 'Tên thật',
    username: 'Username',
    email: 'Email',
    phoneNumber: 'Số điện thoại',
    approved: 'Tình trạng phê duyệt',
    accountCreation: 'Tạo tài khoản',
    defaultPassword: 'Mật khẩu mặc định',
    accountCreationStatus: 'Đã tạo tài khoản',
    ...commonFields,
  },
  createAccountWithDefaultPassword: 'Tạo tài khoản với mật khẩu mặc định',
  defaultPassword: 'Đặt mật khẩu mặc định',
  createAccount: 'Tạo tài khoản',
  // <Permission>
  view: 'Xem danh sách tài khoản',
  approve: 'Phê duyệt',
  delete: 'Hủy yêu cầu',
  add: 'Tạo tài khoản',
  // </Permission
};
