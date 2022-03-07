import commonFields from '../commomFields';
export default {
  name: 'Nhân viên |||| Nhân viên',
  fields: {
    username: 'Nick name',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    address: 'Địa chỉ',
    mobile: 'Số điện thoại',
    email: 'Email',
    fullName: 'Họ và tên',
    currentPassword: 'Mật khẩu hiện tại',
    newPassword: 'Mật khẩu mới',
    ...commonFields,
  },
  messages: {
    passwordUpdated: 'Mật khẩu đã cập nhật',
    errorConfirmPassword: 'Phải giống mật khẩu mới',
    errorNewPassword: 'Phải chứa kí tự a-z/A-Z và 0-9',
  },
};
