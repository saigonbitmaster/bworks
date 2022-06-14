import commonFields from '../commomFields';
export default {
  name: 'Nhân viên |||| Nhân viên',
  isWaterCounter: 'Là nhân viên ghi/thu',
  fields: {
    username: 'Nick name',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    address: 'Địa chỉ',
    mobile: 'Số điện thoại',
    email: 'Email',
    fullName: 'Họ và tên',
    isBanned: 'Đã bị khoá',
    role: 'Quyền hạn',
    currentPassword: 'Mật khẩu hiện tại',
    oldPassword: 'Mật khẩu cũ',
    newPassword: 'Mật khẩu mới',
    ...commonFields,
  },
  messages: {
    passwordUpdated: 'Mật khẩu đã cập nhật',
    errorConfirmPassword: 'Phải giống mật khẩu mới',
    errorNewPassword: 'Phải chứa kí tự a-z/A-Z và 0-9',
  },
  // <Permission>
  view: 'Hiển thị danh sách Nhân viên',
  ban: 'Tạm ngưng cấp quyền truy cập cho Nhân viên',
  edit: 'Chỉnh sửa thông tin Nhân viên',
  create: 'Tạo mới Nhân viên',
  delete: 'Xoá Nhân viên',
  // </Permission>
};
