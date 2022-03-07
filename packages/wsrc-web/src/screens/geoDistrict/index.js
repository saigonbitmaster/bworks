import { GeoChildIcon } from '../../styles/Icons';
import GeoDistrictList from '../../resources/geoDistrict/GeoDistrictList';
import GeoDistrictCreate from '../../resources/geoDistrict/GeoDistrictCreate';
import GeoDistrictEdit from '../../resources/geoDistrict/GeoDistrictEdit';
import GeoDistrictShow from '../../resources/geoDistrict/GeoDistrictShow';
export default {
  name: 'GeoDistrict',
  label: 'generic.pages.geodistrict',
  icon: GeoChildIcon,
  url: 'geodistrict',
  screens: {
    list: GeoDistrictList,
    create: GeoDistrictCreate,
    edit: GeoDistrictEdit,
    show: GeoDistrictShow,
  },
  resources: ['geodistricts', 'geoprovinces', 'geocountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
