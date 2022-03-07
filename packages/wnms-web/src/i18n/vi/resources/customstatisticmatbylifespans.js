export default {
  title: 'Thống kê thời hạn sử dụng vật tư',
  fields: {
    name: 'Tên',
    dom: 'Ngày sản xuất',
    egeTime: 'Tuổi thọ (tháng)',
    usedTime: 'Thời gian đã sử dụng khi nhập kho (tháng)',
    useStartDate: 'Ngày sử dụng',
    quantityUsed: 'Số lượng sử dụng',
    totalRealTimeUsed: 'Thời gian đã sử dụng (tháng)',
    remainTime: 'Thời hạn còn lại (tháng)',
    conclusion: 'Kết luận',
  },
  statistic: {
    MaterialStock: 'Kho',
    MaterialExport: 'Xuất kho',
    MaterialUse: 'Sử dụng',
  },
  statisticWhere: 'Thống kê vật tư',
};
