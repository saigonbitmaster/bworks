import { ClientDebtIcon, ListIcon, StopIcon, HistoryIcon, ResumeIcon } from '../../styles/Icons';
import ClientDebtList from './ClientDebtList';
export default {
  name: 'clientDebt',
  label: 'generic.pages.clientDebt',
  icon: ClientDebtIcon,
  url: 'clientDebt',
  screens: {
    list: ClientDebtList,
  },
  resources: ['clients'],
  active: true,
  access: {
    list: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/GeoDistricts', method: 'get' },
        { url: '/GeoWards', method: 'get' },
        { url: '/GeoQuarters', method: 'get' },
      ],
      icon: ListIcon,
      label: 'resources.clientmeternumbers.permission.listClient',
    },
    historyDebt: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/ClientMeterNumbers', method: 'get' },
      ],
      icon: HistoryIcon,
      label: 'resources.clientmeternumbers.permission.historyDebt',
    },
    stop: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/Clients/stops', method: 'post' },
      ],
      icon: StopIcon,
      label: 'resources.clientmeternumbers.permission.stop',
    },
    resume: {
      apis: [
        { url: '/Clients', method: 'get' },
        { url: '/Clients/resumes', method: 'post' },
      ],
      icon: ResumeIcon,
      label: 'resources.clientmeternumbers.permission.resume',
    },
  },
};
