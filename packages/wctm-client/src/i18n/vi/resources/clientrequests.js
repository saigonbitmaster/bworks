import commonFields from '../commomFields';
export default {
  name: 'Yêu cầu thi công |||| Yêu cầu thi công',
  fields: {
    title: 'Chủ Đề',
    type: 'Kiểu Thi Công',
    status: 'Tình Trạng',
    statusComplete: 'Tình Trạng',
    startMeterNumber: 'Chỉ số đồng hồ bắt đầu',
    oldMeterNumber: 'Chỉ số đồng cũ',
    newMeterNumber: 'Chỉ số đồng mới',
    rootMeterId: 'Đồng hồ tổng',
    setupDate: 'Ngày thực hiện',
    description: 'Mô Tả',
    issue: 'Vấn Đề',
    clientId: 'Khách Hàng',
    installationTeamId: 'Đội Thi Công',
    ...commonFields,
  },
};
