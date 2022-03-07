import commonFields from '../commomFields';
export default {
  name: 'Call/Chat',
  fields: {
    type: 'Loại',
    startTime: 'Bắt đầu',
    endTime: 'Kết thúc',
    content: 'Nội dung',
    status: 'Trạng thái',
    ...commonFields,
  },
  // <Permission>
  view: 'Xem danh sách tài khoản',
  approve: 'Phê duyệt',
  delete: 'Hủy yêu cầu',
  add: 'Tạo tài khoản',
  // </Permission
};
