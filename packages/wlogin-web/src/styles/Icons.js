export const iconToMap = ({
  iconElement,
  color = '#3f51b5',
  dropView = true, // eslint-disable-line
  // viewBox = '0 0 24 24',
  width = 36,
  formatType = 'svg',
}) => {
  // window.API_URL/Icons/dropView/FlowLogger?size=36&color=%23f44336&format=png
  // window.API_URL/Icons/view/FlowLogger?size=36&color=%23f44336&format=png
  let result = { url: `${window.API_URL}/Icons` };
  if (!iconElement) return null;
  result.url += dropView ? '/dropView' : '/view';
  result.url += `/${iconElement}?size=${width}&color=${encodeURIComponent(color)}&format=${formatType}`;
  // console.log(result.url);
  return result;
};

export {
  Dashboard as DashboardIcon,
  Map as DmaIcon,
  PeopleRounded as CustomerIcon,
  InsertChart as StatisticButtonIcon,
  StoreMallDirectory as MatStockIcon,
  HowToVote as MatExportIcon,
  Grain as MatUseIcon,
  Delete as DeleteIcon,
  AssignmentReturned as InputKmlIcon,
  GetApp as ImportKmlIcon,
  AttachFile as AttachFileIcon,
  DragIndicator as WaterMaintenanceIcon,
  People as ClientIcon,
  Visibility as ViewIcon,
  Assignment as RolePermissionIcon,
  Stop as BanIcon,
  Lock as ChangePasswordIcon,
  PlayArrow as ResumeIcon,
  ViewModule as PackageConfigIcon,
  Smartphone as EmployeeAppIcon,
  BarChart as ReportVolumeIcon,
  DeviceHub as NmsIcon,
  People as CtmIcon,
  WavesRounded as WaterSourceIcon,
  NotificationImportant as AlertWaterSourceIcon,
  Opacity as WidgetWaterQuantityIcon,
  AttachMoney as RevenueIcon,
  Grain as WidgetWaterLossIcon,
  Business as BusinessIcon,
  Filter1 as ChartStatisticRevenueIcon,
  Filter2 as ChartStatisticPaymentIcon,
  Filter3 as ChartStatisticClientWriteWaterIcon,
  Filter4 as ChartStatisticQuantityWaterIcon,
  SettingsSystemDaydream as ScadaIcon,
  BarChart as RealTimeBoardIcon,
  LanguageRounded as OrgIcon,
  LocationCity as FactoryIcon,
} from '@material-ui/icons';
export default {};
