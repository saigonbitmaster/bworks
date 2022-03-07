import { QrCodeIcon } from '../../styles/Icons';
import QrGenerate from './QrGenerate';
export default {
  name: 'qrCodeGenerate',
  label: 'resources.qrcodes.name',
  icon: QrCodeIcon,
  url: 'qrCodeGenerate',
  screens: {
    list: QrGenerate,
  },
  resources: ['qrcodes'],
  active: true,
  access: {
    list: {
      apis: [{ url: '/qrcodes/generate', method: 'get' }],
      icon: QrGenerate,
      label: 'resources.qrcodes.name',
    },
  },
};
