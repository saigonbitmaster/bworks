import commonFields from '../commomFields';
export default {
  name: 'Nhà máy |||| Nhà máy',
  fields: {
    name: 'Tên nhà máy',
    acreage: 'Diện tích (m²)',
    position: 'Vị trí',
    designCapacityDay: 'Công suất thiết kế (m³/ngày đêm)',
    currentCapacityDay: 'Công suất hiện tại (m³/ngày đêm)',
    currentLossRate: 'Tỉ lệ thất thoát hiện tại (%)',
    avgPH: 'PH trung bình',
    avgTurbidity: 'Độ đục trung bình (NTU)',
    slug: 'Chuỗi đại diện',
    status: 'Trạng thái',
    useStartDate: 'Ngày hoạt động',
    powerConsumption: 'Điện tiêu thụ (Kwh/ngày đêm)',
    ...commonFields,
  },
  positionFactory: 'Chỉ định vị trí',
  areaFactory: 'Chỉ định vùng cung cấp nước nhà máy',
};
