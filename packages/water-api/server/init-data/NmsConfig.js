'use strict';

module.exports = [
  {
    id: 'StatisticMatStk',
    side: 'all',
    value: {
      high: {
        value: 40,
        condition: '>',
      },
    },
  },
  {
    id: 'StatisticMatLifeSpan',
    side: 'all',
    value: {
      existTime: {
        condition: '>',
        value: 36,
      },
      lessTime: {
        condition: '>',
        value: 12,
      },
    },
  },
  {
    id: 'StatisticMatDMA',
    side: 'all',
    value: {
      high: {
        value: 40,
        condition: '>',
      },
    },
  },
  {
    id: 'RateWaterLeak',
    side: 'all',
    value: {
      warning: {
        condition: '>=',
        value: 20,
      },
      high: {
        condition: '>=',
        value: 70,
      },
    },
  },
  {
    id: 'PressureLimit',
    side: 'all',
    value: 5,
  },
  {
    id: 'Pressure',
    side: 'all',
    value: {
      high: {
        condition: '>',
        value: 120,
      },
      low: {
        condition: '<',
        value: 80,
      },
      loss: {
        condition: '>',
        value: 30,
      },
    },
  },
  {
    id: 'MapDefaultZoom',
    side: 'frontend',
    value: 14,
  },
  {
    id: 'MapDefaultCenter',
    side: 'frontend',
    value: {
      lat: 20.657879,
      lng: 105.926946,
    },
  },
  {
    id: 'Flow',
    side: 'all',
    value: {
      high: {
        value: 120,
        condition: '>',
      },
    },
  },
  {
    id: 'DomesticWaterStandard',
    side: 'all',
    value: [
      { name: 'Clo', lowerLimitSymbol: '>=', upperLimitSymbol: '<=', lowerLimit: 0.3, upperLimit: 0.5 },
      { name: 'NTU', lowerLimit: null, lowerLimitSymbol: '>', upperLimit: 5 },
      { name: 'pH', lowerLimit: 6, upperLimit: 8.5, lowerLimitSymbol: '>=', upperLimitSymbol: '<=' },
    ],
    description: '',
  },
];
