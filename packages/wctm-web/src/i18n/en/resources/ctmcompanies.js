import commonFields from '../commomFields';
export default {
  name: 'Company  |||| Company',
  fields: {
    name: 'Name',
    address: 'Address',
    taxNo: 'Tax No',
    phone: 'Phone',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    bankAccountList: 'Bank account list',
    bankName: 'Bank name',
    bankBranch: 'Bank branch',
    accountName: 'accountName',
    accountNo: 'Account No',
    contactPerson: 'Contact person',
    phoneSupport: 'Phone support',
    creditCards: {
      bankNo: 'Bank No',
      bankAddress: 'Bank address',
    },
    active: 'Active',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  activeButton: 'Active',
  messages: {
    activeSuccess: 'Active success',
  },
  // <Permission>
  view: 'View company list',
  examine: 'Show selected company',
  activate: 'Activate company',
  delete: 'Delete company',
  // </Permission>
};
