import { Add, Create, Search, Delete } from '@material-ui/icons';
import { GeoChildIcon, ViewIcon } from '../../styles/Icons';
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
    view: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.geoquarters.view',
    },
    edit: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.geoquarters.edit',
    },
    delete: {
      apis: [{ url: '/GeoQuarters/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.geoquarters.delete',
    },
    create: {
      apis: [
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/GeoQuarters', method: 'post' },
      ],
      icon: Add,
      label: 'resources.geoquarters.create',
    },
    examine: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/GeoCountries', method: 'get' },
        { url: '/GeoProvinces', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters/{id}', method: 'get' },
      ],
      icon: Search,
      label: 'resources.geowards.examine',
    },
    read: [],
    write: [],
  },
};
