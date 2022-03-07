import commonFields from '../commomFields';
export default {
  name: '',
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
    alertType: 'Loại cảnh báo',
    alertHigh: 'Ngưỡng cao (>=)',
    alertCriticalHigh: 'Ngưỡng rất cao (>=)',
    alertLow: 'Ngưỡng thấp (=<)',
    alertCriticalLow: 'Ngưỡng rất thấp (=<)',
    description: 'Mô tả',
    waterParameter: 'Thông số chất lượng',
    waterSourceId: 'Nguồn nước',
    alertParam: 'Cảnh báo cho',
    alertVolumeLow: 'Ngưỡng thấp (%, =<)',
    alertVolumeCriticalLow: 'Ngưỡng rất thấp (%, =<)',
    alertVolumeHigh: 'Ngưỡng cao (%, >=)',
    alertVolumeCriticalHigh: 'Ngưỡng rất cao (%, >=)',
    alertFlowLow: 'Ngưỡng thấp (m³/h, =<)',
    alertFlowCriticalLow: 'Ngưỡng rất thấp (m³/h, =<)',
    alertFlowHigh: 'Ngưỡng cao (m³/h, >=)',
    alertFlowCriticalHigh: 'Ngưỡng rất cao (m³/h, >=)',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  alertHigh: 'Cảnh báo cao',
  alertLow: 'Cảnh báo thấp',
  alertHighAndLow: 'Cảnh báo cao và thấp',
  alertQuality: 'Chất lượng',
  alertFlow: 'Lưu lượng',
  alertVolume: 'Sản lượng',
};
