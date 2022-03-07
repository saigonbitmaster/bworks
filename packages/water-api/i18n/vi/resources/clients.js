const commonFields = require('../commomFields');
module.exports = {
  name: 'Khách hàng |||| Khách hàng',
  fields: {
    name: 'Tên KH',
    position: 'Tọa độ',
    code: 'Mã KH',
    address: 'Số nhà/Đường',
    phoneNumber: 'Số điện thoại',
    taxNo: 'Mã số thuế',
    type: 'Kiểu',
    billingDate: 'Ngày lập hoá đơn',
    status: 'Tình Trạng',
    registStatus: 'Trạng Thái Đăng Ký',
    familyCount: 'Số hộ',
    memberCount: 'Số người',
    quotaWaterPerPerson: 'Định mức nước (người)',
    countryId: 'Quốc gia',
    provinceId: 'Tỉnh/Thành phố',
    districtId: 'Quận/Huyện',
    wardId: 'Xã/Phường/Thị trấn',
    quarterId: 'Thôn/Ấp/Khu phố',
    formattedAddress: 'Địa chỉ',
    contractNo: 'Mã hợp đồng',
    contractDate: 'Ngày ký hợp đồng',
    contractStatus: 'Tình trạng hợp đồng',
    startMeterDate: 'Ngày Lắp ĐH',
    providerId: 'Nhà cung cấp',
    formulaId: 'Công thức tính cước',
    clientRegisterId: 'Khách hàng',
    dmaId: 'DMA',
    serial: 'Số seri Đồng hồ',
    lastMeterNumber: 'CSĐH cuối',
    lastTimeMeterNumberUpdate: 'TG ghi cuối',
    buyerIdType: 'Loại giấy tờ khách hàng',
    buyerIdNo: 'Số giấy tờ khách hàng',
    buyerFaxNumber: 'Số fax người mua',
    buyerEmail: 'Email người mua',
    buyerBankName: 'Tên ngân hàng',
    buyerBankAccount: 'Tài khoản ngân hàng',
    termInvoice: 'Kỳ hoá đơn',
    termCalculation: 'Tính HĐ đã chọn',
    termCalculations: 'Tính lại cước tất cả',
    termMeterNumber: 'Kỳ ghi nước',
    clientType: 'Loại khách hàng',
    debt: 'Tháng nợ',
    statusSurvey: 'Khảo sát',
    resultSurvey: 'Đạt',
    ...commonFields,
  },
  values: {
    paymentTypeChoices: {
      CASH: 'Tiền mặt',
      TRANSFER: 'Chuyển khoản',
      ALL: 'Tiền mặt/Chuyển khoản',
    },
    type: {
      RESIDENT: 'SH',
      ORGANIZATION: 'HCSN',
      INDUSTRY: 'SX',
      SERVICE: 'KDDV',
    },
    contractStatus: {
      ACTIVE: 'Đang sử dụng',
      STOP: 'Ngừng sử dụng',
    },
    buyerIdType: {
      1: 'Số CMND',
      2: 'Hộ chiếu',
      3: 'Giấy phép kinh doanh',
    },
  },
  clientDistributionMap: {
    active: '%{val} KH đang sử dụng',
    pause: '%{val} KH tạm dừng sử dụng',
    stop: '%{val} KH dừng sử dụng',
  },
  clientWritePayMap: {
    writePaid: '%{val} KH đã ghi nước và đã thanh toán',
    writeUnPaid: '%{val} KH đã ghi nước nhưng chưa thanh toán',
    unWrite: '%{val} KH chưa ghi nước',
  },
  report: {
    totalClient: 'Tổng (KH)',
    activeClient: 'Hoạt động (KH)',
    pauseClient: 'Tạm dừng hoạt động (KH)',
    stopClient: 'Dừng hoạt động (KH)',
    sumTotalClient: 'Tổng khách hàng: %{val} (KH)',
    sumWaterRevenueLoss: 'Tổng lượng nước thất thu: %{val} (m³)',
    sumInvoiceWaterRevenueLoss: 'Tổng tiền thất thu: %{val} (VNĐ)',
    waterRevenueLoss: 'Lượng nước thất thu (m³)',
    invoiceWaterRevenueLoss: 'Số tiền thất thu (VNĐ)',
    revenueLoss: 'Thất thu ',
    sumTotalDebt: 'Tổng nợ: %{val} (VNĐ)',
    debt: 'Nợ (VNĐ)',
    sumTotalInvoice: 'Tổng doanh thu: %{val} (VNĐ)',
    sumTotalWaterUsage: 'Tổng sản lượng: %{val} (m³)',
    totalInvoice: 'Doanh thu (VNĐ)',
    totalWaterUsage: 'Sản lượng (m³)',
    by: 'Thống kê theo',
    waterLoss: 'Thất thoát (m³)',
    totalSupply: 'Cung cấp (m³)',
    totalWaterUsed: 'Sử dụng (m³)',
    rateWaterLoss: 'Tỉ lệ thất thoát (%)',
    titleWaterLoss: 'Thất thoát',
    sumWaterLoss: 'Tổng thất thoát: %{val} (m³)',
    sumRateWaterLoss: 'Tỉ lệ thất thoát: %{val} (%)',
    sumTotalInvoiceWaterRevenueLoss: 'Tổng số tiền thất thu: %{val} (VNĐ)',
    sumTotalWaterRevenueLoss: 'Tổng lượng nước thất thu: %{val} (m³)',
    sumRateWaterRevenueLoss: 'Tỉ lệ:  %{val} (%)',
    rateWaterRevenueLoss: 'Tỉ lệ nước thất thu(%)',
  },
  clientStatus: {
    ACTIVE: 'Hoạt động',
    CONTRACT_SIGNED: 'Đã ký HĐ',
    INSTALL_WAITING: 'Chờ lắp đặt',
    PAUSE: 'Tạm ngưng',
    STOP: 'Ngừng SD',
  },
  statistic: {
    paid: 'Số tiền đã thu',
    unPaid: 'Số tiền chưa thu',
    totalRevenue: 'Tổng doanh thu',
    statisticRevenue: 'Doanh thu',
    statisticPayment: 'Thanh toán',
    statisticClientWriteWater: 'Số liệu đồng hồ',
    statisticQuantityWater: 'Khối lượng nước',
    clientPaid: 'Số khách hàng đã thu',
    clientUnPaid: 'Số khách hàng chưa thu',
    sumClient: 'Tổng số khách hàng',
    countWriteWater: 'Số khách hàng đã ghi nước',
    countUnWriteWater: 'Số khách hàng chưa ghi nước',
    sumWaterUsage: 'Tổng nước sử dụng',
    sumLoss: 'Tổng nước thất thoát',
    sumSupply: 'Tổng nước cung cấp',
  },
};
