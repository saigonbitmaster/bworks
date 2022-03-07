import config from '../Config';
import {
  GeoIcon,
  ClientIcon,
  BusinessIcon,
  ParentMenuMapIcon,
  ParentMenuReportIcon,
  ParentMenuSettingIcon,
  CommunicationIcon,
  ParentMenuEnterpriseIcon,
  PermissionIcon,
} from '../styles/Icons';
import clientRegister from '../screens/clientRegister';
import dashboard from '../screens/dashboard';
import geoProvince from '../screens/geoProvince';
import geoDistrict from '../screens/geoDistrict';
import geoWard from '../screens/geoWard';
import geoQuarter from '../screens/geoQuarter';
import configuration from '../screens/configuration';
import clientMeterNumber from '../screens/clientMeterNumber';
import PaymentCollection from '../screens/paymentCollection';
import clientContract from '../screens/clientContract';
import clientFormat from '../screens/clientFormat';
import clientMeter from '../screens/clientMeter';
import ClientRequest from '../screens/clientRequest';
import ctmTemplate from '../screens/ctmTemplate';
import client from '../screens/client';
import clientDistributionMap from '../screens/clientDistributionMap';
import invoiceLock from '../screens/invoiceLock';
import invoiceExport from '../screens/invoiceExport';
import invoiceHistory from '../screens/invoiceHistory';
import formula from '../screens/formula';
import quotaWater from '../screens/quotawater';
import rootMeter from '../screens/rootmeter';
import clientWriteMap from '../screens/clientWriteMap';
import clientPayMap from '../screens/clientPayMap';
import ctmCompany from '../screens/ctmCompany';
import partner from '../screens/partner';
import installationTeam from '../screens/installationteam';
import reportQuantityClient from '../screens/reportQuantityClient';
import reportDebtClient from '../screens/reportDebtClient';
import reportRevenueLossClient from '../screens/reportRevenueLossClient';
import reportIncome from '../screens/reportIncome';
import reportRevenueLossWater from '../screens/reportRevenueLossWater';
import reportClientMeter from '../screens/reportclientmeter';
import reportWaterStationResult from '../screens/reportWaterStationResult';
import reportMeterNumberByGeo from '../screens/reportMeterNumberByGeo';
import reportInvoiceSummaryByGeo from '../screens/reportInvoiceSummaryByGeo';
import reportMeterNumberSummaryByGeo from '../screens/reportMeterNumberSummaryByGeo';
import reportCustom from '../screens/reportCustom';
import clientDebt from '../screens/clientDebt';
import geoImport from '../screens/geoImport';
import geoGroupImport from '../screens/geoGroupImport';
import ticketSupport from '../screens/ticketSupport';
import announcement from '../screens/announcement';
import appUser from '../screens/appUser';
import role from '../screens/role';
import changePassword from '../screens/changePassword';
import rolePermission from '../screens/rolePermission';
import printInvoiceByGeo from '../screens/printInvoiceByGeo';
import eInvoiceData from '../screens/eInvoiceData';
import reportEInvoice from '../screens/reportEInvoice';
import trackWriteWaterClient from '../screens/trackWriteWaterClient';
import taskboard from '../screens/taskboard';
import packageConfig from '../screens/packageConfig';
import eInvoiceRange from '../screens/eInvoiceRange';
import InspectMeterNumber from '../screens/inspectMeterNumber';
import clientUser from '../screens/clientUser';
import clientUserRequest from '../screens/clientUserRequest';
import notifySetting from '../screens/notifySetting';
import roleAppPermission from '../screens/roleAppPermission';
import conversation from '../screens/conversation';

import employeeApp from './employeeApp';
import qrGenerate from '../screens/qrGenerate';

export default {
  menu: [
    dashboard,
    {
      name: 'ParentMenuClient',
      label: 'generic.pages.parentMenuClient',
      icon: ClientIcon,
      menu: [clientRegister, clientContract, clientMeter, ClientRequest, client],
    },
    {
      name: 'Business',
      label: 'generic.pages.business',
      icon: BusinessIcon,
      menu: [
        clientMeterNumber,
        invoiceLock,
        invoiceExport,
        PaymentCollection,
        clientDebt,
        InspectMeterNumber,
        invoiceHistory,
        trackWriteWaterClient,
        printInvoiceByGeo,
        eInvoiceRange,
      ],
    },
    {
      name: 'ParentMenuMap',
      label: 'generic.pages.parentMenuMap',
      icon: ParentMenuMapIcon,
      menu: [clientDistributionMap, clientWriteMap, clientPayMap],
    },
    clientFormat,
    {
      name: 'Report',
      label: 'generic.pages.parentMenuReport',
      icon: ParentMenuReportIcon,
      menu: [
        reportCustom,
        reportMeterNumberByGeo,
        reportInvoiceSummaryByGeo,
        reportMeterNumberSummaryByGeo,
        reportIncome,
        reportRevenueLossWater,
        reportRevenueLossClient,
        reportDebtClient,
        reportQuantityClient,
        reportClientMeter,
        reportWaterStationResult,
        eInvoiceData,
        reportEInvoice,
      ],
    },
    {
      name: 'ClientCommunication',
      label: 'generic.pages.parentMenuClientCommunication',
      icon: CommunicationIcon,
      menu: [conversation, ticketSupport, announcement],
    },
    {
      name: 'Enterprise',
      label: 'generic.pages.parentMenuEnterprise',
      icon: ParentMenuEnterpriseIcon,
      menu: [ctmCompany, partner, installationTeam],
    },
    {
      name: 'Geo',
      label: 'generic.pages.geo',
      icon: GeoIcon,
      menu: [geoProvince, geoDistrict, geoWard, geoQuarter, geoImport, geoGroupImport],
    },
    {
      name: 'Permission',
      label: 'generic.pages.permission',
      icon: PermissionIcon,
      menu: [appUser, role, rolePermission, roleAppPermission],
    },
    taskboard,
    {
      name: 'Setting',
      label: 'generic.pages.parentMenuSetting',
      icon: ParentMenuSettingIcon,
      menu: [qrGenerate, formula, quotaWater, rootMeter, ctmTemplate, notifySetting],
    },
    configuration,
    packageConfig,
    changePassword,
    employeeApp,
    {
      name: 'ClientUser',
      label: 'generic.pages.parentClientUser',
      icon: ClientIcon,
      menu: [clientUserRequest, clientUser],
    },
  ],
  projectKey: config.projectKey,
};
