import { Add, Create, Search, Delete } from '@material-ui/icons';
import { GeoChildIcon, ViewIcon } from '../../styles/Icons';
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
    view: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.geodistricts.view',
    },
    edit: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.geodistricts.edit',
    },
    delete: {
      apis: [{ url: '/GeoDistricts/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.geodistricts.delete',
    },
    create: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoDistricts', method: 'post' },
      ],
      icon: Add,
      label: 'resources.geodistricts.create',
    },
    examine: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts/{id}', method: 'get' },
      ],
      icon: Search,
      label: 'resources.geodistricts.examine',
    },
    read: [],
    write: [],
  },
};
