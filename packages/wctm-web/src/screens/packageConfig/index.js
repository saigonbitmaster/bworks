import { PackageConfigIcon } from '../../styles/Icons';
import PackageConfig from './PackageConfig';
export default {
  name: 'packageConfig',
  label: 'generic.pages.packageConfig',
  icon: PackageConfigIcon,
  url: 'packageConfig',
  screens: {
    main: PackageConfig,
  },
  resources: ['packageconfigs'],
  active: true,
  access: {
    list: {
      apis: [
        { url: '/ClientMeterNumbers', method: 'get' },
        { url: '/Clients', method: 'get' },
        { url: '/Formulas', method: 'get' },
      ],
      icon: PackageConfigIcon,
      label: 'resources.clientmeternumbers.permission.listClient',
    },
    lock: {
      apis: [{ url: '/ClientMeterNumbers/calculateInvoices', method: 'post' }],
      icon: PackageConfigIcon,
      label: 'resources.clientmeternumbers.permission.lockInvoice',
    },
  },
  master: true,
};
