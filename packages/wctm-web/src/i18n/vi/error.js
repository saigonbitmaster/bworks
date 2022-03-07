export default {
  geocountries: {
    cantDelete: 'Không thể xoá đất nước đã chọn, phải xoá hết dữ liệu con trước!',
  },
  geoprovinces: {
    cantDelete: 'Không thể xoá thành phố hoặc tỉnh đã chọn, phải xoá hết dữ liệu con trước!',
  },
  geodistricts: {
    cantDelete: 'Không thể xoá quận hoặc huyện đã chọn, phải xoá hết dữ liệu con trước!',
  },
  geowards: {
    cantDelete: 'Không thể xoá phường hoặc xã đã chọn, phải xoá hết dữ liệu con trước!',
  },
  file: {
    cantUploadFile: 'Không thể tải file lên server',
    fileNotGiven: 'Không có file được chọn',
  },
  CTMCOMPANY_DATA_NOT_EXIST: 'Dữ liệu công ty không tồn tại',
  CTMCOMPANY_ERROR_ACTIVE: 'Lỗi kích hoạt công ty',
  data: {
    dataSaveFailure: 'Dữ liệu không được lưu',
    geoDataSaveFailure: 'Dữ liệu địa lý không được lưu',
    geoDataDuplicate: 'Dữ liệu địa lý trùng với dữ liệu có sẵn',
    remainedAppUser: 'Còn nhân viên có quyền hạn này',
  },
  INVALID_BANK_ACCOUNT: 'Tài khoản ngân hàng không hợp lệ',
  rolepermissions: {
    lackOfRole: 'Chưa chọn quyền hạn',
    lackOfProject: 'Chưa chọn dự án',
    lackOfSelectedAPIs: 'Chưa chọn API để khoá',
    internalServerError: 'Lỗi nội bộ. Xin vui lòng thử lại sau',
  },
  PRINT_INVOICE_HAS_NOT_DATA: 'Không có dữ liệu hoá đơn',
  DUPLICATE_DATA: 'Trùng với dữ liệu có sẵn',
  DUPLICATE_CODE: 'Trùng mã khách hàng',
  DUPLICATE_SERIAL: 'Trùng số seri',
  DUPLICATE_CONTRACT_NO: 'Trùng mã hợp đồng',
  DUPLICATE_TAX_NO: 'Trùng mã số thuế',
  DUPLICATE_MEMBER: 'Có thành viên trùng lặp',
  CAN_NOT_DELETE_DATA: 'Không thể xoá dữ liệu',
  CAN_NOT_EDIT_DATA: 'Không thể chỉnh sửa dữ liệu',
  DATA_NOT_EXIST: 'Dữ liệu không tồn tại',
  DATA_NOT_FOUND: 'Không có dữ liệu',
  CLIENT_NOT_EXIST: 'Khách hàng không tồn tại',
  CLIENT_NOT_ACTIVE: 'Khách hàng không hoạt động',
  DATA_INVALID: 'Dữ liệu không hợp lệ',
  LOCKED_INVOICE_CAN_NOT_DELETE: 'Khách hàng đã tính cước. Không thể xoá dữ liệu',
  ONLY_DELETE_LAST_MONTH_RECORD: 'Chỉ được xoá dữ liệu của tháng cước cuối cùng',
  DATA_INVALID_CAN_NOT_LOCK_INVOICE: 'Chỉ được chọn khách hàng có thể tính lại cước',
  PAID_CAN_NOT_EDIT_DATA: 'Đã thanh toán. Không thể chỉnh sửa dữ liệu',
  PAID_CAN_NOT_LOCK_INVOICE: 'Một số khách hàng đã thanh toán. Không thể tính lại cước',
  CLIENT_UNACTIVE_CAN_NOT_PAY: 'Một số khách hàng không hoạt động. Không thể thanh toán',
  INTERNAL_SERVER_ERROR: 'Lỗi nội bộ. Xin vui lòng thử lại sau',
  INVOICE_LOCK_INPROGRESS: 'Tính cước đang được thực hiện',
  METER_WRONG_SETUP_DATE: 'Ngày cài đặt đồng hồ lớn hơn tháng cần ghi nước',
  METER_TOO_OLD: 'Chỉ được ghi nước trong phạm vi 1 năm so với hiện tại',
  METER_MISSING_CONFIG_WRITE_DATE: 'Thiếu cấu hình ngày ghi nước hàng tháng, voi lòng liên hệ người quản trị',
  JOB_INVALID: 'Đăng ký xử lý chưa đúng',
  JOB_READY_INPROGRESS: 'Xử lý đang được thực hiện',
  IMPORT_DATA_IN_PROGRESS: 'Nhập dữ liệu đang được thực hiện',
  NON_EXISTENT_DATA: 'Dữ liệu không có sẵn trong database',
  NON_EXISTENT_GEO_GROUP_SCHEMA: 'Chưa có dữ liệu vùng cấp nước',
  NON_EXISTENT_INVOICE_NOTICE_DATA: 'Chưa có dữ liệu đồng hồ hoặc dữ liệu doanh nghiệp',
  REPLACE_METER_OLDMETERNUMBER_GREATE_CURRENTNUMBER: 'Chỉ số đồng hồ cũ phải lớn hơn chỉ số đồng hồ cuối cùng',
  REPLACE_METER_SETUPDATE_GREATE_TODATE: 'Ngày thưc hiện phải lớn hơn ngày ghi nước cuối cùng',
  INVOICE_NO_INVALID: 'Số bắt đầu hoá đơn không hợp lệ',
  NOT_PERMITTED: 'Chưa được cấp quyền sử dụng API này',
  NOT_WITHIN_RADIUS: 'Toạ độ được chọn không nằm trong phạm vi cho phép từ toạ độ tâm của dữ liệu địa lý đã nhập',
  UNRECOGNIZED_GEO_DATA: 'Hệ thống không xử lý được tọa độ được chọn. Xin vui lòng chọn địa điểm khác',
  INVALID_CURRENT_METER_NUMBER: 'Số mới không được phép nhỏ hơn số cũ',
  INVALID_END_MONTH: 'Ngày cuối kỳ ghi nước phải nằm trong tháng kế tiếp của ngày đầu kỳ',
  REQUIRED_DATA_NOT_EXIST: 'Dữ liệu cần thiết không tồn tại',
  REF_DATA_HAS_BEEN_MODIFIED: 'Dữ liệu chỉ dùng để đọc đã bị chỉnh sửa',
  DUPLICATE_EINVOICE: 'Đã xuất Hóa đơn Điện tử cho kỳ này',
  EXISTS_INVOICE_SERIAL: 'Đã có sẵn dải Hóa đơn dùng số seri này',
  MULTIPLE_ACTIVE_EINVOICE_RANGE_CONCURRENTLY: 'Không thể sử dụng cùng lúc 2 dải Hóa đơn',
  INVALID_PRIORITY_VALUE: 'Giá trị ưu tiên không hợp lệ',
  INVALID_INVOICE_SERIAL: 'Số serie không hợp lệ',
  NO_ACTIVE_EINVOICE_RANGE: 'Không có dải Hóa đơn Điện tử được kích hoạt',
  INTERNAL_THIRD_PARTY_SERVICE_ERROR: 'Lỗi nội bộ từ dịch vụ xử lý HĐĐT. Xin vui lòng thử lại sau',
  REQUIRED_INVOICE_ISSUED_DATE_IS_NOT_FOUND: 'Không tìm thấy ngày xuất HDĐT được yêu cầu',
  QR_CODE_EXISTED: 'Trùng mã QR với Đồng hồ sẵn có',
  DUPLICATE_METER_NUMBER: 'Đã được ghi nước',
  EMPTY_DEFAULT_PASSWORD: 'Mật khẩu mặc định không được trống',
  EMPTY_TEMPLATE: 'File biểu mẫu trống',
  MODIFIED_REF_DATA_OR_UNKNOWN_ORIGIN_TEMPLATE:
    'Dữ liệu tham khảo đã bị chỉnh sửa hoặc file biểu mẫu không được xuất bởi server',
  NO_EMAIL_FOR_EINVOICE:
    'Không có địa chỉ mail trong dữ liệu tính cước. Vui lòng thêm địa chỉ email vào KH tương ứng và tính lại kỳ hóa đơn này',
  CLIENT_METER_ID_ALREADY_EXIST: 'Kỳ này đã được ghi',
};
