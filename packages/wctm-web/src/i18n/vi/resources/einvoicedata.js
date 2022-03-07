import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    clientName: 'Tên KH',
    termInvoice: 'Kỳ hoá đơn',
    eInvoiceNo: 'Mã hoá đơn điện tử',
    eInvoiceDate: 'Ngày tạo',
    eInvoiceReservationCode: 'Mã truy xuất',
    eInvoiceStatus: 'Trạng thái',
    clientMeterNumberItem: {
      invoiceData: {
        totalFee: 'Tổng số tiền (VND)',
        totalWaterUsed: 'Tổng số nước (m3)',
        waterFee: 'Tiền trước thuế (VND)',
        taxFee: 'Thuế VAT (VND)',
        sewageFee: 'Phí BVMT (VND)',
      },
    },
    rawResult: { result: { transactionID: 'Mã giao dịch' } },
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách HDĐT',
  examine: 'Hiển thị thông tin HĐĐT',
  // </Permission>
};
