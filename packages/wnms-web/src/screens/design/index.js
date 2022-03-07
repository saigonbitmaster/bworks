import { Add, Edit, Delete } from '@material-ui/icons';
import { DesignSetupIcon, ViewIcon } from '../../styles/Icons';
import Design from './Design';
import { MapEditItem, MapCreateItem } from './DesignDetails';

export default {
  name: 'Design',
  label: 'generic.pages.design',
  url: 'design/:model',
  routeParams: { defaultParams: { model: 'Dma' } },
  icon: DesignSetupIcon,
  screens: {
    main: Design,
    create: MapCreateItem,
    edit: MapEditItem,
  },
  resources: ['nodes', 'dmas', 'materialuses', 'factories', 'gadms', 'pumpstations'],
  access: {
    view: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/Dmas/list', method: 'post' },
        { url: '/Factories', method: 'get' },
        { url: '/Nodes', method: 'get' },
        { url: '/Nodes/list', method: 'post' },
        { url: '/MaterialUses', method: 'get' },
        { url: '/MaterialUses/list', method: 'post' },
      ],
      icon: ViewIcon,
      label: 'generic.permission.design.view',
    },
    create: {
      apis: [
        // dma
        { url: '/Dmas', method: 'get' },
        { url: '/Factories', method: 'get' },
        { url: '/Dmas/{id}', method: 'get' },
        { url: '/Dmas', method: 'post' },
        { url: '/Dmas/list', method: 'post' },

        // node
        { url: '/Nodes/list', method: 'post' },
        { url: '/Nodes', method: 'post' },
        { url: '/Nodes', method: 'get' },

        // nha may
        { url: '/MaterialUses/list', method: 'post' },
        { url: '/Gadms', method: 'get' },
        { url: '/Nodes/{id}', method: 'get' },
        { url: '/Icons/dropView/{name}', method: 'get' },
        { url: '/Gadms/{id}', method: 'get' },
        { url: '/Factories/createFactory', method: 'post' },

        // materials
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialExports/{id}', method: 'get' },
        { url: '/MaterialStocks/{id}', method: 'get' },
        { url: '/MaterialDetailTypes/{id}', method: 'get' },
        { url: '/MaterialUses/createMatInMap', method: 'post' },
        { url: '/MaterialUses', method: 'post' },
      ],
      icon: Add,
      label: 'generic.permission.design.create',
    },
    edit: {
      apis: [
        // dma
        { url: '/Dmas', method: 'get' },
        { url: '/Dmas/{id}', method: 'get' },
        { url: '/Factories', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Dmas/{id}', method: 'put' },
        { url: '/Dmas/list', method: 'post' },

        // node
        { url: '/Nodes/{id}', method: 'get' },
        { url: '/Nodes/{id}', method: 'put' },
        { url: '/Nodes/list', method: 'post' },
        { url: '/Nodes', method: 'get' },

        // nha may
        { url: '/MaterialUses/list', method: 'post' },
        { url: '/Factories/{id}', method: 'get' },
        { url: '/Gadms', method: 'get' },
        { url: '/Icons/dropView/{name}', method: 'get' },
        { url: '/Gadms/{id}', method: 'get' },
        { url: '/Factories/editFactory/{id}', method: 'put' },

        // materials
        { url: '/MaterialExports/{id}', method: 'get' },
        { url: '/MaterialUses/{id}', method: 'get' },
        { url: '/MaterialExports', method: 'get' },
        { url: '/MaterialUses/editMatInMap/{id}', method: 'put' },
      ],
      icon: Edit,
      label: 'generic.permission.design.edit',
    },
    delete: {
      apis: [
        // dma
        { url: '/Dmas', method: 'get' },
        { url: '/Dmas/deleteDma', method: 'get' },

        // materials
        { url: '/MaterialUses/deleteMatMap', method: 'get' },
        { url: '/MaterialUses', method: 'get' },

        // nha may
        { url: '/Factories/{id}', method: 'delete' },
        { url: '/Factories', method: 'get' },

        // node
        { url: '/Nodes/deleteNode', method: 'get' },
        { url: '/Nodes', method: 'get' },
      ],
      icon: Delete,
      label: 'generic.permission.design.delete',
    },
  },
};
