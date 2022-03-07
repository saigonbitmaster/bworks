import commonFields from '../commomFields';
export default {
  fields: {
    name: 'Tên biểu mẫu',
    model: 'Đối tượng',
    ...commonFields,
  },
  // <Permission>
  view: 'Hiển thị màn hình Nhập Dữ liệu Khách hàng',
  import: 'Nhập dữ liệu Khách hàng',
  exportTemplate: 'Xuất biểu mẫu chuẩn dạng Excel',
  // </Permission>
};
