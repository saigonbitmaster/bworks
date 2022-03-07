import { Add, Create, Search, Delete } from '@material-ui/icons';
import { PartnerIcon, ViewIcon } from '../../styles/Icons';
import ListPartner from '../../resources/partner/listPartner';
import CreatePartner from '../../resources/partner/createPartner';
import EditPartner from '../../resources/partner/editPartner';
import ShowPartner from '../../resources/partner/showPartner';

export default {
  name: 'Partner',
  label: 'generic.pages.partner',
  icon: PartnerIcon,
  url: 'partner',
  screens: {
    list: ListPartner,
    create: CreatePartner,
    edit: EditPartner,
    show: ShowPartner,
  },
  resources: ['waterproviders', 'clients', 'dmas', 'geowards'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/WaterProviders', method: 'get' },
        { url: '/Dmas', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.waterproviders.view',
    },
    edit: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/WaterProviders', method: 'get' },
        { url: '/WaterProviders/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.waterproviders.edit',
    },
    delete: {
      apis: [{ url: '/WaterProviders/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.waterproviders.delete',
    },
    create: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/WaterProviders', method: 'post' },
      ],
      icon: Add,
      label: 'resources.waterproviders.create',
    },
    examine: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/WaterProviders/{id}', method: 'get' },
      ],
      icon: Search,
      label: 'resources.waterproviders.examine',
    },
    read: [],
    write: [],
  },
};
