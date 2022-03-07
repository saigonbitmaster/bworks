import { PackageConfigIcon } from '../../styles/Icons';
import PackageConfig from './PackageConfig';
export default {
  name: 'PackageConfig',
  label: 'generic.pages.packageConfig',
  icon: PackageConfigIcon,
  url: 'packageConfig',
  screens: {
    main: PackageConfig,
  },
  resources: ['packageconfigs'],
  active: true,
  access: {},
  master: true,
};
