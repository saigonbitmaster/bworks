import commonFields from '../commomFields';
export default {
  name: 'eInvoice range  |||| eInvoice range',
  fields: {
    name: 'Name',
    provider: 'Service provider',
    supplierTaxCode: 'Supplier tax code',
    templateCode: 'eInvoice template code',
    serial: 'Serial',
    totalInv: 'Total invoices',
    numOfpublishInv: 'Issued invoices',
    isActive: 'Use this invoice range',
    priority: 'Priority',
    verifyAt: 'Verified at',
    ...commonFields,
  },
};
