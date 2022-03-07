import commonFields from '../commomFields';
export default {
  name: '',
  titleList: 'Cảnh báo',
  time: 'Thời gian',
  alert1: 'Rất cao',
  alert2: 'Cao',
  alert3: 'Thấp',
  alert4: 'Rất thấp',
  alert5: 'Bình thường',
  value: 'Giá trị',
  numberAlertCriticalHigh: 'Số cảnh báo rất cao: %{val}',
  numberAlertHigh: 'Số cảnh báo cao: %{val}',
  numberAlertLow: 'Số cảnh báo thấp: %{val}',
  numberAlertCriticalLow: 'Số cảnh báo rất thấp: %{val}',
  sumWaterSource: 'Tổng số nguồn: %{val}',
  fields: {
    name: 'Tên',
    prefix: 'Tiền tố',
    fullName: 'Tên đầy đủ',
    code: 'Mã',
    population: 'Dân số',
    countryId: 'Quốc gia',
    provinceId: 'Tỉnh / Thành phố',
    districtId: 'Quận / Huyện',
    position: 'Vị trí trung tâm',
    description: 'Mô tả',
    selectParameter: 'Chọn thông số chất lượng',
    selectGroup: 'Chọn nhóm nguồn',
    selectSource: 'Chọn nguồn nước',
    waterSourceName: 'Nguồn nước',
    waterParameterName: 'Thông số',
    logTime: 'Thời điểm',
    avgValue: 'Giá trị',
    alert: 'Trạng thái',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  tab1: 'Chi tiết',
  tab2: 'Biểu đồ',
};
