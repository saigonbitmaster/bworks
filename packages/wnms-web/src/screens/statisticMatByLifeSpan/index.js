import { StatisticMatByLifeSpanIcon } from '../../styles/Icons';
import StatisticMatByLifeSpan from './StatisticMatByLifeSpan';

export default {
  name: 'StatisticMatByLifeSpan',
  label: 'generic.pages.statisticMatByLifeSpan',
  icon: StatisticMatByLifeSpanIcon,
  url: 'statisticMatByLifeSpan',
  screens: {
    main: StatisticMatByLifeSpan,
  },
  resources: ['customstatisticmatbylifespans'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/MaterialStocks/statisticMatByLifeSpan', method: 'get' }],
    },
  },
};
