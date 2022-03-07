import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên Nhóm',
    contactPersonId: 'Người liên hệ',
    appUserIds: 'Thành viên',
    providerId: 'Nhà Cung Cấp',
    description: 'Mô tả',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Nhóm thi công',
  delete: 'Xoá sách Nhóm thi công',
  examine: 'Hiển thị thông tin Nhóm thi công được chọn',
  // </Permission>
};
