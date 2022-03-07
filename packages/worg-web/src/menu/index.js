import dashboard from '../screens/dashboard';
import srcDashboard from '../screens/srcDashboard';
import nmsDashboard from '../screens/nmsDashboard';
import ctmDashboard from '../screens/ctmDashboard';
import changePassword from '../screens/changePassword';
import scada from '../screens/scada';
import { ConfigurationIcon } from '../styles/Icons';
import scadaConfig from '../screens/scadaConfig';
// import realtimeBoard from '../screens/realtimeBoard';

export default {
  menu: [
    dashboard,
    srcDashboard,
    nmsDashboard,
    ctmDashboard,
    scada,
    {
      name: 'Config',
      label: 'generic.pages.config',
      icon: ConfigurationIcon,
      menu: [scadaConfig],
    },
    changePassword,
  ],
};
