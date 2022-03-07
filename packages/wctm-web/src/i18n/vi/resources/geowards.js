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
    radius: 'Bán kính khu vực',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  nameWard: 'Phường / xã',
  // <Permission>
  view: 'Hiển thị danh sách Phường/Xã',
  delete: 'Xoá Phường/Xã',
  examine: 'Hiển thị thông tin Phường/Xã được chọn',
  // </Permission>
};
