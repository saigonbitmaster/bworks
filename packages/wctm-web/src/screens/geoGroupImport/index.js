import Add from '@material-ui/icons/Add';
import { GeoChildIcon, ViewIcon, EditIcon } from '../../styles/Icons';
import ListGeoGroupImport from './ListGeoGroupImport';

export default {
  name: 'ImportGeoGroup',
  label: 'generic.pages.importGeoGroup',
  icon: GeoChildIcon,
  url: 'importGeoGroup',
  screens: {
    list: ListGeoGroupImport,
  },
  resources: ['geogroups', 'geowards', 'geoquarters'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/GeoGroups', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.importgeogroups.view',
    },
    edit: {
      apis: [
        { url: '/GeoWards/{id}', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/GeoGroups/updateGeoGroupAndGeoQuarters', method: 'post' },
      ],
      icon: EditIcon,
      label: 'resources.importgeogroups.edit',
    },
    create: {
      apis: [
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
        { url: '/GeoGroups/createGeoGroup', method: 'get' },
      ],
      icon: Add,
      label: 'resources.importgeogroups.create',
    },
    read: [],
    write: [],
  },
};
