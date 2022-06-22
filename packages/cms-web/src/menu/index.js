import dashboard from '../screens/dashboard';
import {
  GeoIcon,
  ParentMenuReportIcon,
  ParentMenuStatisticIcon,
} from '../styles/Icons';

import FundHistory from '../screens/reportFund';
import PostedJob from '../screens/reportPostedJob';
import SmartContract from '../screens/reportSmartContract';
import configuration from '../screens/configuration';
import Deposit from '../screens/deposit';
import WithDraw from '../screens/withdraw';
import PostJob from '../screens/postjob';
import Employer from '../screens/employer';
import JobSeeker from '../screens/jobseeker';
import BiddingJob from '../screens/bidjobs';
import smartContract from '../screens/contractedjobs';
import ReportKpi from '../screens/reportKpi';
import SourceTemplate from '../screens/changepassword';
import AdfScannerIcon from '@material-ui/icons/AccountBoxOutlined';

import appUser from '../screens/account';

export default {
  renderFromServer: false,
  menu: [
    dashboard,
    {
      name: 'accountManagement',
      label: 'generic.pages.accountManagement',
      icon: AdfScannerIcon,
      menu: [Employer, JobSeeker],
    },
    {
      name: 'jobManagement',
      label: 'generic.pages.jobManagement',
      icon: ParentMenuStatisticIcon,
      menu: [PostJob, BiddingJob, smartContract],
    },
    {
      name: 'fundManagement',
      label: 'generic.pages.parentMenuReport',
      icon: ParentMenuReportIcon,
      menu: [Deposit, WithDraw],
    },
    
    {
      name: 'report',
      label: 'generic.pages.report',
      icon: GeoIcon,
      menu: [FundHistory, PostedJob, SmartContract, ReportKpi],
    },
    SourceTemplate,
    configuration,
    appUser
    
  ],
};