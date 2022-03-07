import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên',
    address: 'Địa chỉ',
    taxNo: 'Mã số thuế',
    phone: 'Điện thoại',
    fax: 'Số fax',
    email: 'Địa chỉ email',
    website: 'Trang chủ',
    bankAccountList: 'Tài khoản ngân hàng',
    invoiceSignPerson: "Người ký hoá đơn",
    bankName: 'Tên ngân hàng',
    bankBranch: 'Tên chi nhánh',
    accountName: 'Tên tài khoản',
    accountNo: 'Số tài khoản',
    contactPerson: 'Người liện hệ',
    phoneSupport: 'Điện thoại CSKH',
    invoiceNoticeNo: "Chỉ số phiếu thu cuối",
    creditCards: {
      bankNo: 'Số tài khoản',
      bankAddress: 'Địa chỉ',
    },
    active: 'Kích hoạt',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  activeButton: 'Kích hoạt',
  messages: {
    activeSuccess: 'Kích hoạt công ty thành công',
  },
  // <Permission>
  view: 'Hiển thị danh sách Công ty',
  examine: 'Hiển thị thông tin Công ty được chọn',
  activate: 'Kích hoạt Công ty',
  delete: 'Xoá Công ty',
  // </Permission>
};
