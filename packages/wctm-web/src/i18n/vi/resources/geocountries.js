import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên',
    prefix: 'Tiền tố',
    fullName: 'Tên đầy đủ',
    code: 'Mã',
    population: 'Dân số',
    position: 'Vị trí trung tâm',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Quốc gia',
  delete: 'Xoá Quốc gia',
  examine: 'Hiển thị thông tin Quốc gia được chọn',
  // </Permission>
};
