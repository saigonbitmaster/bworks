module.exports = [
  { id: 'MapDefaultCenter', side: 'frontend', value: { lat: 21.227145, lng: 105.940563 } },
  { id: 'MapDefaultZoom', side: 'frontend', value: 14 },
  {
    id: 'StatisticMatLifeSpan',
    side: 'all',
    value: {
      existTime: {
        condition: '>',
        value: 54,
      },
      lessTime: {
        condition: '>',
        value: 6,
      },
    },
  },
  { id: 'ClientWriteMeterNumberDate', side: 'all', value: 15 },
];
