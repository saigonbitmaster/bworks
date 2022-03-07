import commonFields from '../commomFields';
export default {
  name: 'Súc sả |||| Súc xả',
  fields: {
    dmaId: 'DMA',
    date: 'Ngày',
    value: 'Lượng nước súc sả (m³)(có thể ảnh hưởng đến tính toán thất thoát)',
    valueList: 'Lượng nước súc sả (m³)',
    ...commonFields,
  },
  create: 'Tạo',
  edit: 'Chỉnh sửa',
  delete: 'Xoá',
};
