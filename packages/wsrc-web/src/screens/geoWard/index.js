import { GeoChildIcon } from '../../styles/Icons';
import GeoWardList from '../../resources/geoWard/GeoWardList';
import GeoWardCreate from '../../resources/geoWard/GeoWardCreate';
import GeoWardEdit from '../../resources/geoWard/GeoWardEdit';
import GeoWardShow from '../../resources/geoWard/GeoWardShow';
export default {
  name: 'GeoWard',
  label: 'generic.pages.geoward',
  icon: GeoChildIcon,
  url: 'geoward',
  screens: {
    list: GeoWardList,
    create: GeoWardCreate,
    edit: GeoWardEdit,
    show: GeoWardShow,
  },
  resources: ['geowards', 'geodistricts', 'geoprovinces', 'geocountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
