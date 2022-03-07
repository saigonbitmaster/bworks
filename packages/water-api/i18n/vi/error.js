module.exports = {
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
  NON_EXISTENT_DATA: 'Dữ liệu không có sẵn trong database',
  REQUIRED_DATA_NOT_EXIST: 'Không có dữ liệu được yêu cầu',
  FILE_NOT_EXIST: 'Không tồn tại file kể trên',
  INVALID_DATA: 'Dữ liệu không hợp lệ',
  INAPPRORIATE_LINKED_DATA: 'Dữ liệu không đúng quan hệ',
  DUPLICATE_DATA: 'Dữ liệu bị trùng với dữ liệu có sẵn trong database',
  NON_EXISTENT_GEODATA: 'Dữ liệu địa lý chưa có sẵn trong database',
  DATA_IS_NOT_NUMERIC: 'Dữ liệu không ở dạng số',
  NON_EXISTENT_REF_GEODATA: 'Dữ liệu địa lý nguồn chưa có sẵn trong database',
  NON_EXISTENT_BAC_NINH_WATER_PROVIDER: 'Dữ liệu về nhà cung cấp nước tỉnh Bắc Ninh chưa có sẵn trong database',
  DATA_TOO_LONG: 'Độ dài dữ liệu vượt ngưỡng cho phép',
  importData: {
    DUPLICATE_CODE: 'Khách hàng "<%= firstClient %>" có mã số trùng với Khách hàng "<%= secondClient %>"',
    NON_INTEGRITY_GEO: '<%= province %> không khớp với <%= district %> không khớp với <%= ward %>',
    DUPLICATE_TAX_NO: 'Khách hàng "<%= firstClient %>" có số thuế trùng với Khách hàng "<%= secondClient %>"',
    UNPARSEABLE_GEO_POINT: 'Khách hàng "<%= name %>" có số tọa độ "<%= data %>"không đúng định dạng',
    NON_INTEGRITY_GEO_WITH_QUARTER:
      '<%= province %> không khớp với <%= district %> không khớp với <%= ward %> không khớp với <%= quarter %>',
  },
};
