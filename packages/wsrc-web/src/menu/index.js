import dashboard from '../screens/dashboard';
import {
  GeoIcon,
  ParentMenuReportIcon,
  ParentMenuDesignIcon,
  ParentMenuStandardIcon,
  ParentMenuStatisticIcon,
  MonitorIcon,
} from '../styles/Icons';

// import GeoCountry from '../screens/geoCountry';
import GeoProvince from '../screens/geoProvince';
import GeoDistrict from '../screens/geoDistrict';
import GeoWard from '../screens/geoWard';
import GeoQuarter from '../screens/geoQuarter';
import configuration from '../screens/configuration';
import geoImport from '../screens/geoImport';
import WaterParameter from '../screens/waterparameter';
import MeasureMethod from '../screens/measuremethod';
import WaterStandard from '../screens/waterstandard';
import InterfaceStandard from '../screens/interfacestandard';
import Sensor from '../screens/sensor';
import Meter from '../screens/meter';
import DataLogger from '../screens/datalogger';
import Pump from '../screens/pump';
import WaterSource from '../screens/watersource';
import WaterSourceGroup from '../screens/watersourcegroup';
import AlertThreshold from '../screens/alertthreshold';
import ReportQuality from '../screens/reportquality';
import ReportFlow from '../screens/reportflow';
import ReportVolume from '../screens/reportvolume';
import ReportSummarizedQuality from '../screens/reportsummarizedquality';
import reportMaterial from '../screens/reportmaterial';
import Factory from '../screens/factory';
import SourceTemplate from '../screens/sourcetemplate';
// import GisDesign from '../screens/gisDesign';
import Pipe from '../screens/pipe';
import MapPipe from '../screens/mapPipe';

export default {
  menu: [
    dashboard,
    {
      name: 'ParentMenuStatistic',
      label: 'generic.pages.statisticParent',
      icon: ParentMenuStatisticIcon,
      menu: [ReportVolume, ReportSummarizedQuality, reportMaterial],
    },
    {
      name: 'Report',
      label: 'generic.pages.parentMenuReport',
      icon: ParentMenuReportIcon,
      menu: [ReportQuality, ReportFlow],
    },
    {
      name: 'Design',
      label: 'generic.pages.parentMenuDesign',
      icon: ParentMenuDesignIcon,
      // menu: [GisDesign, Factory, WaterSourceGroup, WaterSource, Pump, Sensor, Meter, DataLogger],
      menu: [Factory, Pipe, WaterSourceGroup, WaterSource, Pump, Sensor, Meter, DataLogger],
    },
    
    {
      name: 'Standard',
      label: 'generic.pages.parentMenuStandard',
      icon: ParentMenuStandardIcon,
      menu: [WaterStandard, WaterParameter, MeasureMethod, AlertThreshold, InterfaceStandard],
    },
    {
      name: 'Geo',
      label: 'generic.pages.geo',
      icon: GeoIcon,
      menu: [GeoProvince, GeoDistrict, GeoWard, GeoQuarter, geoImport],
    },
    SourceTemplate,
    configuration,
  ],
};
