import { MapWaterLossIcon } from '../../styles/Icons';
import MapWaterLoss from './MapWaterLoss';

export default {
  name: 'MapWaterLoss',
  label: 'generic.pages.mapWaterLoss',
  icon: MapWaterLossIcon,
  url: 'mapWaterLoss',
  screens: {
    main: MapWaterLoss,
  },
  resources: ['logwaterlossdmamonths'],
  access: {
    view: {
      apis: [
        { url: '/NmsConfigs', method: 'get' },
        { url: '/Dmas/mapWaterLoss', method: 'get' },
      ],
    },
  },
};
