export default {
  title: 'Material report by time',
  fields: {
    name: 'Name',
    dom: 'Manufacture date',
    egeTime: 'Lifespan (months)',
    usedTime: 'In use duration before warehousing (months)',
    useStartDate: 'Installation date',
    quantityUsed: 'Deployed value',
    totalRealTimeUsed: 'In use duration (months)',
    remainTime: 'Valid remaining duration (months)',
    conclusion: 'Status',
  },
  statistic: {
    MaterialStock: 'In stock',
    MaterialExport: 'Exported',
    MaterialUse: 'In use',
  },
  statisticWhere: 'Material report',
};
