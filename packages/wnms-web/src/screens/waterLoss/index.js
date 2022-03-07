import { WaterLossIcon } from '../../styles/Icons';
import WaterLoss from './WaterLoss';
export default {
  name: 'WaterLoss',
  label: 'generic.pages.waterLoss',
  icon: WaterLossIcon,
  url: 'waterLoss',
  screens: {
    main: WaterLoss,
  },
  resources: ['customwaterlossbylevelpipes', 'customwaterlossbydmas'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Dmas/statisticQuantityByMonth', method: 'get' },
        { url: '/Dmas', method: 'get' },
      ],
    },
  },
};
