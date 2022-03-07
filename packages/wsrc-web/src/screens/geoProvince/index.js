import { GeoChildIcon } from '../../styles/Icons';
import GeoProvinceList from '../../resources/geoProvince/GeoProvinceList';
import GeoProvinceCreate from '../../resources/geoProvince/GeoProvinceCreate';
import GeoProvinceEdit from '../../resources/geoProvince/GeoProvinceEdit';
import GeoProvinceShow from '../../resources/geoProvince/GeoProvinceShow';
export default {
  name: 'GeoProvince',
  label: 'generic.pages.geoprovince',
  icon: GeoChildIcon,
  url: 'geoprovince',
  screens: {
    list: GeoProvinceList,
    create: GeoProvinceCreate,
    edit: GeoProvinceEdit,
    show: GeoProvinceShow,
  },
  resources: ['geoprovinces', 'geocountries'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
