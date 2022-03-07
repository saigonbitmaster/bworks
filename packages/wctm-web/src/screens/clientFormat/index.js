import { TemplateIcon, ViewIcon, ImportIcon } from '../../styles/Icons';
import ListClientDataFormat from './ListClientFormat';
export default {
  name: 'clientFormat',
  label: 'generic.pages.clientFormat',
  icon: TemplateIcon,
  url: 'clientformats',
  screens: {
    main: ListClientDataFormat,
  },
  resources: ['clientformats'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/ClientFormats', method: 'get' }],
      icon: ViewIcon,
      label: 'resources.clientformats.view',
    },
    import: {
      apis: [
        { url: '/ExcelFiles/{container}/upload', method: 'post' },
        { url: '/Clients/importClientsFromExcel', method: 'get' },
        { url: '/ClientRegisters/importClientRegistersFromExcel', method: 'get' },
      ],
      icon: ImportIcon,
      label: 'resources.clientformats.import',
    },
    exportTemplate: {
      apis: [{ url: '/ExcelFiles/{container}/download/{file}', method: 'get' }],
      icon: TemplateIcon,
      label: 'resources.clientformats.exportTemplate',
    },
    read: [],
    write: [],
  },
};
