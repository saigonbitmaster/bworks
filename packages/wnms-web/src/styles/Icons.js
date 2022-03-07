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
  AccountBox as AppUserIcon,
  Group as PermissionIcon,
  SettingsOverscan as DesignSetupIcon,
  LocalLibrary as ParentMenuMatIcon,
  AccountBalance as ManageMatIcon,
  ArtTrack as StatisticMatInStkIcon,
  PlaylistAddCheck as StatisticMatByDmaIcon,
  GraphicEq as StatisticMatByLifeSpanIcon,
  Eject as ExportStockIcon,
  Print as PrintIcon,
  Add as AddMatTypeIcon,
  ViewList as MatDetailTypeIcon,
  Memory as OtherIcon,
  Transform as InsertChart,
  Camera as ParentMenuStatisticIcon,
  Settings as ConfigurationIcon,
  Web as MonitoringIcon,
  InsertChart as EmploymentIcon,
  InsertChart as TaskboardIcon,
  Error as RestoreMatIcon,
  Autorenew as ReturnMatForStockIcon,
  Equalizer as ParentMenuReportIcon,
  FormatColorReset as WaterLossIcon,
  Opacity as QuantityIcon,
  LocationCity as FactoryIcon,
  NetworkCheck as PressureIcon,
  BubbleChart as FlowRateIcon,
  Timeline as StatusIcon,
  BlurLinear as WaterFlowPressureIcon,
  AccessTime as LogTimeIcon,
  BubbleChart as MaterialOnMapIcon,
  InsertChart as StatisticIcon,
  ArrowBack as BackIcon,
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
  RemoveRedEyeRounded as DetailIcon,
  Waves as ReportQualityIcon,
  Timeline as LineChartIcon,
  AddAlert as AlertThresholdIcon,
  SpellCheck as ParentMenuStandardIcon,
  Explore as MapQualityLoggerIcon,
  InvertColors as MapWaterLossIcon,
  SettingsSystemDaydream as PumpStationIcon,
  GraphicEq as ElectricMonitorIcon,
  VideoLabelRounded as OverviewMonitorIcon,
} from '@material-ui/icons';

export { default as FilterIcon } from './svgs/FilterIcon';
export { default as FlowLoggerIcon } from './svgs/FlowLoggerIcon';
export { default as MeterIcon } from './svgs/MeterIcon';
export { default as NodeIcon } from './svgs/NodeIcon';
export { default as PipeIcon } from './svgs/PipeIcon';
export { default as PressureReducingIcon } from './svgs/PressureReducingIcon';
export { default as PumpIcon } from './svgs/PumpIcon';
export { default as QualityLoggerIcon } from './svgs/QualityLoggerIcon';
export { default as ElectricLoggerIcon } from './svgs/ElectricLoggerIcon';
export { default as TankIcon } from './svgs/TankIcon';
export { default as ValveIcon } from './svgs/ValveIcon';
export { default as AddTaskboardIcon } from './svgs/AddTaskboardIcon';
export default {};
