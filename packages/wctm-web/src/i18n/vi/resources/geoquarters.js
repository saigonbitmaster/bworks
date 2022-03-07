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
    wardId: 'Phường / Xã',
    position: 'Vị trí trung tâm',
    radius: 'Bán kính khu vực',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Khu phố/Xóm',
  delete: 'Xoá Khu phố/Xóm',
  examine: 'Hiển thị thông tin Khu phố/Xóm được chọn',
  // </Permission>
};
