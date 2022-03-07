import commonFields from '../commomFields';
export default {
  name: 'Water provider |||| Water provider',
  fields: {
    name: 'Name',
    address: 'Address',
    taxNo: 'Tax No',
    phone: 'Phone',
    fax: 'Fax',
    email: 'Email',
    website: 'Website',
    bankAccountList: 'Bank account list',
    providerType: 'Provider type',
    bankName: 'Bank name',
    bankBranch: 'Bank branch',
    accountName: 'Account name',
    accountNo: 'Account No',
    dmaIds: 'DMAs',
    wardIds: 'Wards',
    id: 'Root meter',
    contactPerson: 'Contact person',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View provider list',
  delete: 'Delete provider',
  examine: 'Show selected provider',
  // </Permission>
};
