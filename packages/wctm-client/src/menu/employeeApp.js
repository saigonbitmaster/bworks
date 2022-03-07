import { EmployeeAppIcon } from '../styles/Icons';
export default {
  name: 'employeeSmartPhone',
  label: 'generic.pages.employeeSmartPhone',
  icon: EmployeeAppIcon,
  url: 'employeeSmartPhone',
  resources: ['clients'],
  // screens: ['writeMeterNumber', 'ClientInvoice', 'clients', 'ClientRequest', 'offlineSync'],
  active: true,
  access: {
    common: {
      apis: [
        { url: '/Clients/getInfoWaterUsage', method: 'post' },
        { url: '/Clients/getInfoQualityWater', method: 'post' },
        { url: '/Meternumbersubmits/postSubmit', method: 'post' },
        { url: '/Watersources', method: 'get' },
        { url: '/Waterparameters', method: 'get' },
      ],
    },
  },
};
