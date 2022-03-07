import commonFields from '../commomFields';
export default {
  name: 'Công thức tính cước |||| Công thức tính cước',
  fields: {
    name: 'Tên',
    applyDate: 'Ngày hiệu lực',
    sewageFee: 'Phí nước thải (%)',
    tax: 'Thuế (%)',
    unit: 'Đơn vị tính',
    from: 'Từ (m³)',
    to: 'Đến (m³)',
    price: 'Giá tiền (VND/m³)',
    addNorm: 'Thêm định mức',
    delNorm: 'Xoá định mức',
    normGroups: 'Định mức',
    ...commonFields,
  },
  noLimit: 'Không giới hạn',
  inputValGreater: 'Nhập giá trị lớn hơn %{val}',
  // <Permission>
  view: 'Hiển thị danh sách Công thức tính cước',
  edit: 'Chỉnh sửa Công thức tính cước',
  create: 'Tạo mới Công thức Tính cước',
  delete: 'Xoá Công thức Tính cước',
  // </Permission>
};
