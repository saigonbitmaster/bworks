import commonFields from '../commomFields';
export default {
  name: 'Plant |||| Plant',
  fields: {
    name: 'Name',
    acreage: 'Acreage (m²)',
    position: 'Position',
    designCapacityDay: 'Matched jobs (m³/day)',
    currentCapacityDay: 'Current Capacity (m³/day)',
    currentLossRate: 'Current loss rate (%)',
    avgPH: 'Average PH',
    avgTurbidity: 'Average turbidity (NTU)',
    slug: 'Paterns',
    status: 'Status',
    useStartDate: 'Starting date',
    powerConsumption: 'Power consumption (Kwh/day)',
    ...commonFields,
  },
  positionFactory: 'Position',
  areaFactory: 'Supplying area',
};
