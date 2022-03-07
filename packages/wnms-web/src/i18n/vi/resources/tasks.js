import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  fields: {
    name: 'Công việc',
    status: 'Trạng thái',
    statuses: {
      todo: 'Mới',
      doing: 'Đang thực hiện',
      finish: 'Hoàn thành',
    },
    type: 'Loại',
    types: {
      office: 'Văn phòng',
      technical: 'Kỹ thuật',
      other: 'Khác',
    },
    priority: 'Độ ưu tiên',
    priorities: {
      urgent: 'Khẩn cấp',
      high: 'Cao',
      normal: 'Bình thường',
      low: 'Thấp',
    },
    startDate: 'Ngày tạo',
    dueDate: 'Ngày đến hạn',
    finishDate: 'Ngày hoàn thành',
    estimateTime: 'Số ngày dự kiến',
    attachedFiles: 'Tệp đính kèm',
    assigneeId: 'Thực hiện',
    ...commonFields,
  },
  list: 'Danh sách công việc',
  create: 'Tạo công việc',
  edit: 'Sửa công việc',
  show: 'Chi tiết công việc',
  file: 'Đính kèm',
  view: 'Liệt kê các công việc',
  delete: 'Xoá công việc',
};
