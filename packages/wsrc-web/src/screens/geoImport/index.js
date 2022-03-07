import { GeoChildIcon } from '../../styles/Icons';
import ImportGeo from './ImportGeo';
export default {
  name: 'ImportGeo',
  label: 'generic.pages.importGeo',
  icon: GeoChildIcon,
  url: 'importGeo',
  screens: {
    list: ImportGeo,
  },
  resources: ['refquarters', 'refwards', 'refdistricts', 'refprovinces', 'refcountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
