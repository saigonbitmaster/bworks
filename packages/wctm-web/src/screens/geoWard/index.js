import { Add, Create, Search, Delete } from '@material-ui/icons';
import { GeoChildIcon, ViewIcon } from '../../styles/Icons';
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
    view: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.geowards.view',
    },
    edit: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoWards/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.geowards.edit',
    },
    delete: {
      apis: [{ url: '/GeoWards/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.geowards.delete',
    },
    create: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoWards', method: 'post' },
      ],
      icon: Add,
      label: 'resources.geowards.create',
    },
    examine: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards/{id}', method: 'get' },
      ],
      icon: Search,
      label: 'resources.geowards.examine',
    },
    read: [],
    write: [],
  },
};
