import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  name: 'Cấu hình mạng nước |||| Cấu hình mạng nước',
  fields: {
    id: 'Tên',
    ids: {
      MapDefaultCenter: 'Vị trí bản đồ',
      MapDefaultZoom: 'Zoom bản đồ',
      PressureLimit: 'Giới hạn áp lực',
      QualityFluo: 'Cảnh báo Fluorescein',
      QualityPh: 'Cảnh báo PH',
      Flow: 'Lưu lượng',
      Pressure: 'Áp lực',
      StatisticMatStk: 'Thống kê vật tư trong kho',
      StatisticMatDMA: 'Thống kê vật tư theo DMA',
      StatisticMatLifeSpan: 'Thống kê tuổi thọ vật tư',
      ClientWriteMeterNumberDate: 'Ngày ghi nước',
      ClientMeterNumberExpiredDate: 'Số ngày hết hạn sử dụng đồng hồ',
    },
    side: 'Phạm vi',
    sides: {
      all: 'Tất cả',
      frontend: 'Frontend',
      backend: 'Backend',
    },
    value: 'Giá trị',
    values: {
      number: 'Giá trị',
      lat: 'Vĩ độ',
      lng: 'Kinh độ',
    },
    ...commonFields,
  },
  listTitle: 'Danh sách cấu hình',
  createTitle: 'Tạo cấu hình',
  editTitle: 'Sửa cấu hình',
  pressure: {
    high: 'Cảnh báo cao (%)',
    low: 'Cảnh báo yếu (%)',
    loss: 'Cảnh báo mất nước (%)',
  },
  flow: {
    high: 'Cảnh báo cao (%)',
  },
  statisticMatStk: {
    high: 'Tình trạng tồn kho cao (%)',
  },
  statisticMatDMA: {
    high: 'Tình trạng tồn kho cao (%)',
  },
  statisticMatLifeSpan: {
    existTime: 'Tốt',
    lessTime: 'Sắp hết hạn',
  },
  // <Permission>
  view: 'Hiển thị danh sách Cấu hình',
  create: 'Tạo mới Cấu hình',
  edit: 'Chỉnh sửa thông tin Cấu hình',
  delete: 'Xoá thông tin Cấu hình',
  // </Permission>
};
