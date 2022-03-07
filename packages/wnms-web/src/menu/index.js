import {
  PermissionIcon,
  ParentMenuMatIcon,
  ParentMenuStatisticIcon,
  EmploymentIcon,
  ParentMenuReportIcon,
  MonitoringIcon,
  ParentMenuStandardIcon,
} from '../styles/Icons';
import dashboard from '../screens/dashboard';
import appUser from '../screens/appUser';
import design from '../screens/design';
import manageMat from '../screens/manageMat';
import statisticMatInStk from '../screens/statisticMatInStk';
import matDetailType from '../screens/matDetailType';
import statisticMatByDma from '../screens/statisticMatByDma';
import statisticMatByLifeSpan from '../screens/statisticMatByLifeSpan';
import configuration from '../screens/configuration';
import taskboard from '../screens/taskboard';
import waterLoss from '../screens/waterLoss';
import waterFlowPressure from '../screens/waterFlowPressure';
import materialOnMap from '../screens/materialOnMap';
import mapWaterLoss from '../screens/mapWaterLoss';
import inputKml from '../screens/inputKml';
import waterMaintenance from '../screens/waterMaintenance';
import role from '../screens/role';
import rolePermission from '../screens/rolePermission';
import packageConfig from '../screens/packageConfig';
import employeeApp from './employeeApp';
import changePassword from '../screens/changePassword';
import reportQuality from '../screens/reportQuality';
import alertThreshold from '../screens/alertthreshold';
import mapQualityLogger from '../screens/mapQualityLogger';
import pumpStation from '../screens/pumpStation';
// import overviewMonitor from '../screens/overviewMonitor';
// import electricMonitor from '../screens/electricMonitor';
export default {
  menu: [
    dashboard,
    {
      name: 'Monitoring',
      label: 'generic.pages.monitoring',
      icon: MonitoringIcon,
      menu: [mapWaterLoss, materialOnMap, mapQualityLogger],
    },
    {
      name: 'ParentMenuStatistic',
      label: 'generic.pages.statisticParent',
      icon: ParentMenuStatisticIcon,
      menu: [statisticMatInStk, statisticMatByDma, statisticMatByLifeSpan],
    },
    {
      name: 'Report',
      label: 'generic.pages.parentMenuReport',
      icon: ParentMenuReportIcon,
      menu: [waterLoss, waterFlowPressure, reportQuality],
    },
    {
      name: 'ParentMenuMat',
      label: 'generic.pages.parentMenuMat',
      icon: ParentMenuMatIcon,
      menu: [matDetailType, manageMat],
    },
    design,
    pumpStation,
    inputKml,
    waterMaintenance,
    {
      name: 'Permission',
      label: 'generic.pages.permission',
      icon: PermissionIcon,
      menu: [appUser, role, rolePermission],
    },
    configuration,
    {
      name: 'Standard',
      label: 'generic.pages.parentMenuStandard',
      icon: ParentMenuStandardIcon,
      menu: [alertThreshold],
    },
    {
      name: 'Employment',
      label: 'generic.pages.employment',
      icon: EmploymentIcon,
      menu: [taskboard],
    },
    packageConfig,
    changePassword,
    employeeApp,
  ],
};
