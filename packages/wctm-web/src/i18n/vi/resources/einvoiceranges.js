import commonFields from '../commomFields';
export default {
  name: 'Dải HĐĐT',
  fields: {
    name: 'Tên',
    provider: 'Nhà cung cấp',
    supplierTaxCode: 'Mã số  thuế ',
    templateCode: 'Mẫu hóa đơn',
    serial: 'Ký hiệu hóa đơn',
    totalInv: 'Tối đa',
    numOfpublishInv: 'Đã phát hành',
    isActive: 'Sử dụng dải HĐ này',
    priority: 'Thứ tự ưu tiên',
    verifyAt: 'Cập nhật lúc',
    webUsername: 'Tên tài khoản web',
    webPassword: 'Mật khẩu web',
    apiUsername: 'Tên tài khoản API',
    apiPassword: 'Mật khẩu API',
    ...commonFields,
  },
};
