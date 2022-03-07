import { TrackWriteWaterClientIcon } from '../../styles/Icons';
import ClientMeterNumberList from './ClientMeterNumberList';

export default {
  name: 'trackWriteWaterClient',
  icon: TrackWriteWaterClientIcon,
  url: 'trackWriteWaterClient',
  label: 'generic.pages.trackWriteWaterClient',
  resources: ['clientmeternumbers', 'clients', 'clientaliastrackwriwaterclients'],
  screens: {
    list: ClientMeterNumberList,
  },
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
      ],
      icon: TrackWriteWaterClientIcon,
      label: 'resources.clientmeternumbers.permission.trackWriteWaterClient',
    },
  },
};
