import commonFields from '../commomFields';
export default {
  name: 'Trạm bơm',
  fields: {
    name: 'Tên',
    designCapacity: 'Tổng CS điện năng hiện tại (kw/m3)',
    designElectricCapacity: 'Tổng CS điện năng thiết kế (kw/m3)',
    designElectricRate: 'Design Electric Rate',
    factoryId: 'Nhà máy',
    ...commonFields,
  },
  edit: 'Chỉnh sửa',
  delete: 'Xoá',
};
