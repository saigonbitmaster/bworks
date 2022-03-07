import CommonFields from '../commomFields';
export default {
  fields: {
    clientId: 'Khách hàng',
    fromDate: 'Từ ngày',
    toDate: 'Đến ngày',
    previousNumber: 'Số cũ',
    currentNumber: 'Số mới',
    newMeterNumber: 'Số mới',
    totalWaterUsed: 'Tổng nước SD',
    waterFee: 'Phí nước',
    taxFee: 'Thuế',
    sewageFee: 'Phí Môi trường',
    totalFee: 'Tổng tiền',
    paymentStatus: 'Thanh Toán',
    ...CommonFields,
  },
};
