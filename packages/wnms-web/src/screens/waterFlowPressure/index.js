import { WaterFlowPressureIcon } from '../../styles/Icons';
import WaterFlowPressure from './WaterFlowPressure';
export default {
  name: 'WaterFlowPressure',
  label: 'generic.pages.waterFlowPressure',
  icon: WaterFlowPressureIcon,
  url: 'waterFlowPressure',
  screens: {
    main: WaterFlowPressure,
  },
  resources: [
    'dmas',
    'customwaterflows',
    'customwaterpressures',
    'customwaterflowpressurelevel1s',
    'customwaterflowpressurelevel2s',
  ],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Dmas/statisticRuntimeLoggerHour', method: 'get' },
        { url: '/Dmas', method: 'get' },
      ],
    },
  },
};
