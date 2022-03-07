import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên',
    _id: 'Mã định mức',
    value: 'Giá trị',
    description: 'mô tả',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Định mức',
  examine: 'Hiển thị thông tin Định mức được chọn',
  // </Permission>
};
