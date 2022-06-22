import { RevenueIcon } from '../../styles/Icons';
import ListreportFund from '../../resources/reportFund/listReportFund';
import CreatereportFund from '../../resources/reportFund/createReportFund';
import EditreportFund from '../../resources/reportFund/editReportFund';
import ShowreportFund from '../../resources/reportFund/showReportFund';

export default {
  name: 'reportFund',
  label: 'generic.pages.reportFund',
  icon: RevenueIcon,
  url: 'reportFund',
  screens: {
    list: ListreportFund,
    create: CreatereportFund,
    edit: EditreportFund,
    show: ShowreportFund,
  },
  resources: ['reportfunds'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
