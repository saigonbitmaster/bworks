export default {
  responseCode: {
    vnpay: {
      '00': 'Giao dịch thành công',
      notExist: 'Lệnh giao dịch không tồn tại trong hệ thống',
      returned: 'Lệnh giao dịch đã được xử lý',
      amountNotMatched: 'Giao dịch không thành công do: Số tiền thanh toán không khớp với dạng lưu trữ ở hệ thống',
      invalidSignature: 'Sai chữ ký',
      '01': 'Giao dịch đã tồn tại',
      '04': 'Khởi tạo GD không thành công do Website đang bị tạm khóa',
      '05':
        'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '06':
        'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.',
      '07':
        'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch',
      '08':
        'Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.',
      '09':
        'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10':
        'Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      failed: 'Giao dịch thất bại',
    },
    momo: {
      '0': 'Giao dịch thành công',
      notExist: 'Lệnh giao dịch không tồn tại trong hệ thống',
      returned: 'Lệnh giao dịch đã được xử lý',
      amountNotMatched: 'Giao dịch không thành công do: Số tiền thanh toán không khớp với dạng lưu trữ ở hệ thống',
      '99': 'Lỗi không xác định. Có khả năng Tài khoản hết hạn mức giao dịch trong ngày',
      '2129': 'Dữ liệu giao dịch đã bị thay đổi. Hủy giao dịch',
    },
  },
  modal: {
    cancel: 'Hủy',
    pay: 'Thanh toán',
    title: 'Thanh toán tiền nước',
    amount: 'Số tiền',
    orderInfo: 'Nội dung thanh toán',
    orderInfoValue: 'Thanh toán tiền nước cho KH mã %{code} kỳ %{time}',
    provider: 'Phương thức thanh toán',
    reset: 'Thiết lập lại',
  },
};
