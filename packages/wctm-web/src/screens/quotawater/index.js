import { Create, Search } from '@material-ui/icons';
import { QuotaWaterIcon } from '../../styles/Icons';
import ListQuotaWater from '../../resources/quotawater/listQuotaWater';
import EditQuotaWater from '../../resources/quotawater/editQuotaWater';
import ShowQuotaWater from '../../resources/quotawater/showQuotaWater';

export default {
  name: 'QuotaWater',
  label: 'generic.pages.quotaWater',
  icon: QuotaWaterIcon,
  url: 'quotaWater',
  screens: {
    main: ListQuotaWater,
    edit: EditQuotaWater,
    show: ShowQuotaWater,
  },
  resources: ['quotaWaters'],
  active: true,
  access: {
    view: {
      apis: [{ url: '/QuotaWaters', method: 'get' }],
      icon: QuotaWaterIcon,
      label: 'resources.quotawaters.view',
    },
    edit: {
      apis: [
        { url: '/QuotaWaters/{id}', method: 'get' },
        { url: '/QuotaWaters/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.quotawaters.edit',
    },
    examine: {
      apis: [{ url: '/QuotaWaters/{id}', method: 'get' }],
      icon: Search,
      label: 'resources.quotawaters.examine',
    },
    read: [],
    write: [],
  },
};
