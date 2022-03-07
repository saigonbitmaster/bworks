import commonFields from '../commomFields';
import unit from '../unit';
export default {
  name: 'DMA |||| DMA',
  fields: {
    name: 'DMA name',
    fullName: 'Fullname',
    parentDmaId: 'Parent DMA',
    level: 'DMA level',
    slug: 'Paterns',
    avgDemandDay: `Design demand (${unit.flow}/day)`,
    population: 'Population',
    supplyCapacityDay: `Supply capacity (${unit.flow}/day)`,
    designPressure: `Design pressure (${unit.pressure})`,
    center: 'Center postion',
    boundary: 'Boundary',
    factoryId: 'Plant Id',
    ...commonFields,
  },
  statistic: {
    time: 'Time',
    totalWaterInput: 'Total input value (m³)',
    totalMainternance: 'Maintain volume (m³)',
    totalLeak: 'Water loss (m³)',
    totalWaterOuput: 'Total output volume (m³)',
  },
  areaDma: 'Select DMA',
};
