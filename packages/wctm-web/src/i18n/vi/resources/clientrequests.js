import commonFields from '../commomFields';
export default {
  name: 'Yêu cầu thi công |||| Yêu cầu thi công',
  fields: {
    title: 'Chủ Đề',
    type: 'Kiểu Thi Công',
    formattedAddress: 'Địa chỉ',
    status: 'Tình Trạng',
    statusComplete: 'Tình Trạng',
    startMeterNumber: 'Chỉ số đồng hồ bắt đầu',
    oldMeterNumber: 'Chỉ số đồng hồ cũ',
    newMeterNumber: 'Chỉ số đồng hồ mới',
    rootMeterId: 'Đồng hồ tổng',
    setupDate: 'Ngày thực hiện',
    description: 'Mô Tả',
    issue: 'Vấn Đề',
    clientId: 'Khách Hàng',
    installationTeamId: 'Đội Thi Công',
    ...commonFields,
  },
  // <Permission>
  view: 'Hiển thị',
  export: 'Xuất Excel',
  completeRequest: 'Hoàn thành Yêu cầu Thi công',
  showHistory: 'Hiển thị Lịch sử Thi công',
  // </Permission>
};
