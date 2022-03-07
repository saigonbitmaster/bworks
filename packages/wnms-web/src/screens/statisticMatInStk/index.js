import { StatisticMatInStkIcon } from '../../styles/Icons';
import StatisticMatInStk from './StatisticMatInStk';
import ViewDetailMatStock from './ViewDetailMatStock';
export default {
  name: 'StatisticMatInStk',
  label: 'generic.pages.statisticMatInStk',
  icon: StatisticMatInStkIcon,
  url: 'statisticMatInStk',
  screens: {
    main: StatisticMatInStk,
    viewDetailMatStock: { subPath: ':idTypeMat', component: ViewDetailMatStock },
  },
  resources: ['customstatisticmatstocks'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/MaterialStocks/statisticMatStock', method: 'get' },
        { url: '/MaterialStocks/viewDetailMatStock', method: 'get' },
      ],
    },
  },
};
