import { MaterialOnMapIcon } from '../../styles/Icons';
import MaterialOnMap from './MaterialOnMap';

export default {
  name: 'MaterialOnMap',
  label: 'generic.pages.materialOnMap',
  icon: MaterialOnMapIcon,
  url: 'materialOnMap',
  screens: {
    main: MaterialOnMap,
  },
  access: {
    view: {
      apis: [
        { url: '/NmsConfigs', method: 'get' },
        { url: '/MaterialUses/tree', method: 'get' },
        { url: '/MaterialUses/getGeoJsonMat', method: 'get' },
      ],
    },
  },
};
