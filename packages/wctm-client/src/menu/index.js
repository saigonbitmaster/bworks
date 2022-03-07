import InforWaterUsage from '../screens/infoWaterUsage';
import { ParentMenuInfoWaterNetworkIcon, CommunicationIcon } from '../styles/Icons';
import Pressure from '../screens/pressure';
import QualityWater from '../screens/qualityWater';
import InfoClient from '../screens/infoClient';
import TicketSupport from '../screens/ticketSupport';
import Announcement from '../screens/announcement';
import ChangePassword from '../screens/changePassword';
import EmployeeApp from './employeeApp';
export default {
  menu: [
    InforWaterUsage,
    {
      name: 'Report',
      label: 'generic.pages.parentMenuInfoWaterNetwork',
      icon: ParentMenuInfoWaterNetworkIcon,
      menu: [Pressure, QualityWater],
    },
    {
      name: 'ClientCommunication',
      label: 'generic.pages.parentMenuClientCommunication',
      icon: CommunicationIcon,
      menu: [TicketSupport, Announcement],
    },
    InfoClient,
    //EmployeeApp,
    ChangePassword,
  ],
};
