import { GeoChildIcon, ViewIcon, ExportIcon } from '../../styles/Icons';
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
    view: {
      apis: [
        { url: '/RefProvinces', method: 'get' },
        { url: '/RefDistricts', method: 'get' },
        { url: '/RefWards', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.importgeo.view',
    },
    import: {
      apis: [{ url: '/GeoWards/importGeo', method: 'post' }],
      icon: ExportIcon,
      label: 'resources.importgeo.import',
    },
    read: [],
    write: [],
  },
};
