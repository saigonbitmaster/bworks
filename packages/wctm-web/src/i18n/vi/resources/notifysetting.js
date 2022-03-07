module.exports = {
  typeChoice: {
    SCHEDULE: 'Định kỳ',
    RUN_NOW: 'Lập tức',
    CUSTOM: 'Tuỳ chỉnh',
  },
  validate: {
    recipient: 'Xin chọn đối tượng thông báo',
    repeat: 'Xin chọn định thời cho thông báo',
  },
  status: {
    RUNNING: 'Hoạt động',
    STOP: 'Dừng',
    WAITING: 'Chờ',
  },
  category: {
    NOTIFY: 'Thông báo',
    EMAIL: 'Thư điện tử',
  },
  target: {
    employee: 'Nhân viên',
    client: 'Khách hàng',
  },
  periodic: {
    value: 'Tần suất',
    everySecond: {
      value: 'Mỗi giây',
    },
    everyMinute: {
      value: 'Mỗi phút',
    },
    everyHour: {
      value: 'Mỗi giờ',
    },
    daily: {
      value: 'Hằng ngày',
      unit: 'Ngày',
    },
    weekly: {
      value: 'Hằng tuần',
      unit: 'Tuần',
    },
    monthly: {
      value: 'Hằng tháng',
      unit: 'Tháng',
      titleSelect: 'Ngày trong tháng',
    },
    yearly: {
      value: 'Hằng năm',
      unit: 'Năm',
      titleSelect: 'Tháng trong năm',
    },
  },
  dialog: {
    targetGroupLabel: 'Cấu hình người nhận thông báo',
  },
  weekly: {
    monday: 'Thứ hai',
    tuesday: 'Thứ ba',
    wednesday: 'Thứ tư',
    thursday: 'Thứ năm',
    friday: 'Thứ sáu',
    saturday: 'Thứ bảy',
    sunday: 'Chủ nhật',
  },
  fields: {
    name: 'Tên công việc',
    type: 'Loại',
    periodic: 'Tần suất',
    text: 'Tin nhắn thông báo',
    description: 'Ghi chú',
    role: 'Người nhận',
    project: 'Dự án',
    category: 'Phân loại',
    tag: 'Nhãn',
    status: 'Trạng thái',
    repeatDescription: 'Lịch trình',
    target: 'Người nhận',
  },
  tag: {
    NOTIFY: 'Thông báo',
    EMAIL: 'Thư điện tử',
  },
  due: {
    label: 'Hết hạn',
    prefix: {
      never: 'Không bao giờ',
      expireOn: 'Trong',
      expireAfter: 'Sau',
      perTime: 'lần',
    },
  },
  targetGroup: {
    functionGroup: 'Lọc theo chức năng',
    geographyGroup: 'Lọc theo địa lý',
    fields: {
      invoice: 'Hoá đơn',
      meternumber: 'Ghi nước',
    },
    functionGroupTarget: {
      invoice: {
        paidInvoice: 'Đã thanh toán',
        unpaidInvoice: 'Chưa thanh toán',
      },
      meternumber: {
        writedMeterNumber: 'Đã ghi nước',
        unwritedMeterNumber: 'Chưa ghi nước',
      },
      note: 'Tháng tính theo thời điểm thông báo gửi đi',
    },
  },
  customRecurrence: {
    label: 'Tuỳ chỉnh thời gian, tần suất thông báo',
  },
};
