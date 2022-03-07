import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    clientname: 'Tên thông báo',
    abc: 'Day la Abc',
    createdDate: 'Ngày tạo',
    appUserId: 'Người tạo',
    sendDate: 'Ngày gửi',
    masterBody: 'Nội dung',
    announcementTypeId: 'Loại thông báo',
    announcementPriorityId: 'Độ quan trọng',
    dmaIds: 'Vùng nhận thông báo',
    shortContent: 'Tóm tắt',
    fullContent: 'Nội dung',
    sendPublic: 'Gửi cho tất cả',
    ...commonFields,
  },
  list: 'Danh sách',
  create: 'Tạo',
  edit: 'Sửa',
  show: 'Chi tiết',
  // <Permission>
  view: 'Hiển thị danh sách Thông báo',
  examine: 'Hiển thị thông tin Thông báo được chọn',
  delete: 'Xoá thông tin Thông báo',
  // </Permission>
};
