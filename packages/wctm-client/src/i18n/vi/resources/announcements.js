import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Tên thông báo',
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
};
