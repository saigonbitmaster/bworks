import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên',
    address: 'Địa chỉ',
    taxNo: 'Mã số thuế',
    phone: 'Số điện thoại',
    fax: 'Số fax',
    email: 'Địa chỉ email',
    website: 'Trang chủ',
    bankAccountList: 'Tài khoản ngân hàng',
    providerType: 'Loại đối tác',
    bankName: 'Tên ngân hàng',
    bankBranch: 'Tên chi nhánh',
    accountName: 'Tên tài khoản',
    accountNo: 'Số tài khoản',
    dmaIds: 'Vùng cấp nước',
    wardIds: 'Xã được cấp nước',
    id: 'Đồng hồ tổng',
    contactPerson: 'Người liện hệ',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Đối tác',
  delete: 'Xoá Đối tác',
  examine: 'Hiển thị thông tin Đối tác được chọn',
  // </Permission>
};
