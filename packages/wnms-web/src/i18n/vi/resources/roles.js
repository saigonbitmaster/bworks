import commonFields from '../commomFields';
export default {
  fields: {
    title: 'Tên',
    name: 'Từ khoá',
    slug: 'Từ khoá',
    created: 'Ngày tạo',
    project: 'Dự án',
    ...commonFields,
  },
  // <Permission>
  view: 'Hiển thị Quyền hạn',
  edit: 'Chỉnh sửa thông tin Quyền hạn',
  delete: 'Xoá Quyền hạn',
  create: 'Tạo mới Quyền hạn',
  // </Permission>
};
