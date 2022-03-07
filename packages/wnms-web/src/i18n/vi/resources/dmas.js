import commonFields from '../commomFields';
import unit from '../unit';
export default {
  name: 'DMA |||| DMA',
  fields: {
    name: 'Tên DMA',
    fullName: 'Tên đầy đủ',
    parentDmaId: 'DMA Cha',
    level: 'Cấp DMA',
    slug: 'Chuỗi đại diện',
    avgDemandDay: `Nhu cầu trung bình (${unit.flow}/ngày)`,
    population: 'Dân số',
    supplyCapacityDay: `Khả năng cấp nước (${unit.flow}/ngày)`,
    designPressure: `Áp lực thiết kế (${unit.pressure})`,
    center: 'Trung tâm',
    boundary: 'Đường biên',
    factoryId: 'Nhà máy',
    ...commonFields,
  },
  statistic: {
    time: 'Thời gian',
    totalWaterInput: 'SL đầu vào (m³)',
    totalMainternance: 'Súc xả (m³)',
    totalLeak: 'Thất thoát (m³)',
    totalWaterOuput: 'SL đầu ra (m³)',
  },
  areaDma: 'Chỉ định vùng DMA',
};
