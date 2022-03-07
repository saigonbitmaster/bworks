import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    id: 'Mã biểu mẫu',
    createdDate: 'Ngày tạo',
    updatedDate: 'Ngày cập nhật',
    data: 'File đính kèm',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Biểu mẫu',
  examine: 'Hiển thị thông tin Biểu mẫu được chọn',
  // <Permission>
};
