import { Add, Create, Search, Delete } from '@material-ui/icons';
import { GeoChildIcon, ViewIcon } from '../../styles/Icons';
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
    view: {
      apis: [
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.geoprovinces.view',
    },
    edit: {
      apis: [
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoProvinces/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.geoprovinces.edit',
    },
    delete: {
      apis: [{ url: '/GeoProvinces/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.geoprovinces.delete',
    },
    create: {
      apis: [
        { url: '/CtmConfigs', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'post' },
      ],
      icon: Add,
      label: 'resources.geoprovinces.create',
    },
    examine: {
      apis: [
        { url: '/GeoProvinces/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
      ],
      icon: Search,
      label: 'resources.geoprovinces.examine',
    },
    read: [],
    write: [],
  },
};
