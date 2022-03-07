import commonFields from '../commomFields';
export default {
  name: 'trả lời',
  fields: {
    name: 'Tên',
    createdDate: 'Ngày tạo',
    appUserId: 'Người tạo',
    isClosed: 'Trạng thái',
    masterBody: 'Nội dung hỗ trợ',
    ticketTypeId: 'Loại hỗ trợ',
    ticketSupportId: 'Tên phiếu hỗ trợ',
    ticketPriorityId: 'Mức ưu tiên',
    reply: 'Trả lời',
    body: 'Nội dung',
    Id: 'Nội dung chi tiết',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
};
