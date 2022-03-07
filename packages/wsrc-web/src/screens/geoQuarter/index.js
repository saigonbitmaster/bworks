import { GeoChildIcon } from '../../styles/Icons';
import GeoQuarterList from '../../resources/geoQuarter/GeoQuarterList';
import GeoQuarterCreate from '../../resources/geoQuarter/GeoQuarterCreate';
import GeoQuarterEdit from '../../resources/geoQuarter/GeoQuarterEdit';
import GeoQuarterShow from '../../resources/geoQuarter/GeoQuarterShow';
export default {
  name: 'GeoQuarter',
  label: 'generic.pages.geoquarter',
  icon: GeoChildIcon,
  url: 'geoquarter',
  screens: {
    list: GeoQuarterList,
    create: GeoQuarterCreate,
    edit: GeoQuarterEdit,
    show: GeoQuarterShow,
  },
  resources: ['geoquarters', 'geowards', 'geodistricts', 'geoprovinces', 'geocountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
