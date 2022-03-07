import { StatisticMatByDmaIcon } from '../../styles/Icons';
import StatisticMatByDma from './StatisticMatByDma';
import ViewDetailMatDma from './ViewDetailMatDma';

export default {
  name: 'StatisticMatByDma',
  label: 'generic.pages.statisticMatByDma',
  icon: StatisticMatByDmaIcon,
  url: 'statisticMatByDma',
  screens: {
    main: StatisticMatByDma,
    viewDetailMatDma: { subPath: ':idTypeMat', component: ViewDetailMatDma },
  },
  resources: ['customstatisticmatbydmas'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/MaterialStocks/statisticMatByDMA', method: 'get' },
        { url: '/Dmas', method: 'get' },
        { url: '/MaterialStocks/viewDetailMatDma', method: 'get' },
      ],
    },
  },
};
