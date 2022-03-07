import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên phiếu',
    createdDate: 'Ngày tạo',
    createdPerson: 'Người tạo',
    appUserId: 'Người tạo',
    isClosed: 'Đóng phiếu',
    clientUserId: 'Người nhận',
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
  // <Permission>
  view: 'Hiển thị danh sách Phiếu hỗ trợ',
  examine: 'Hiển thị thông tin Phiếu hỗ trợ được chọn',
  answer: 'Trả lời Phiếu hỗ trợ',
  delete: 'Xoá Phiếu hỗ trợ',
  // </Permission>
};
