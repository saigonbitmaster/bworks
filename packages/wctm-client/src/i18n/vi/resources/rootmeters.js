import commonFields from '../commomFields';
export default {
  name: 'Đồng Hồ Tổng |||| Đồng Hồ Tổng',
  fields: {
    name: 'Tên',
    meterLevel: 'Phân Cấp Đồng Hồ',
    seri: 'Seri',
    providerId: 'Nhà Cung Cấp',
    providerZoneId: 'Vùng Cung Cấp',
    dmaId: 'DMA',
    parentMeterId: 'Đồng Hồ Cha',
    ...commonFields,
  },
};
