import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên ĐH',
    size: 'Kích Thước Đồng Hồ',
    seri: 'Số Seri',
    waterProviderId: 'Thuộc Nhà Cung Cấp',
    description: 'Mô tả',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Đồng hồ tổng',
  examine: 'Hiển thị thông tin Đồng hồ tổng được chọn',
  delete: 'Xoá thông tin Đồng hồ',
  // </Permission>
};
