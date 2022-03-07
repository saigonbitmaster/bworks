import PaymentCollectionList from '../../resources/paymentCollection/PaymentCollectionList';
import PaymentCollectionEdit from '../../resources/paymentCollection/PaymentCollectionEdit';
import PaymentCollectionCreate from '../../resources/paymentCollection/PaymentCollectionCreate';
import PaymentCollectionHistoryList from '../../resources/paymentCollection/PaymentCollectionHistoryList';
import ClientPaymentHistoryList from '../../resources/paymentCollection/ClientPaymentHistoryList';
import { ClientMeterNumberIcon, DeleteIcon, ListIcon, EditIcon, HistoryIcon, ExportIcon } from '../../styles/Icons';

export default {
  name: 'paymentCollection',
  icon: ClientMeterNumberIcon,
  url: 'paymentcollection',
  label: 'generic.pages.paymentCollection',
  resources: ['sumpaymentcollections', 'clients', 'appusers', 'paymentcollections', "clientmeternumbers"],
  screens: {
    list: PaymentCollectionList,
    create: PaymentCollectionCreate,
    edit: PaymentCollectionEdit,
    history: {component: PaymentCollectionHistoryList, subPath: ":id"},
    clientpaymenthistory: {component: ClientPaymentHistoryList, subPath: ":id"},
  },
  active: true,
  access: {}
  


};
