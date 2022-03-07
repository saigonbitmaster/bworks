import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên phiếu',
    createdDate: 'Ngày tạo',
    appUserId: 'Người tạo',
    clientUserId: 'Người tạo',
    createdPerson: 'Người tạo',
    isClosed: 'Đóng phiếu',
    masterBody: 'Nội dung',
    ticketTypeId: 'Loại hỗ trợ',
    ticketSupportId: 'Phiếu hỗ trợ',
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
