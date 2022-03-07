import commonFields from '../commomFields';
export default {
  name: 'EInvoice |||| EInvoice',
  fields: {
    clientName: 'Client name',
    termInvoice: 'Term invoice',
    eInvoiceNo: 'eInvoice code',
    eInvoiceDate: 'Issued date',
    eInvoiceReservationCode: 'Reservation code',
    eInvoiceStatus: 'Status',
    clientMeterNumberItem: {
      invoiceData: {
        totalFee: 'Total fee (usd)',
        totalWaterUsed: 'Total water usage (m3)',
        waterFee: 'Fee before tax (usd)',
        taxFee: 'VAT tax (usd)',
        sewageFee: 'Sewage fee (usd)',
      },
    },
    rawResult: { result: { transactionID: 'Transaction ID' } },
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View announcement list',
  examine: 'Show selected announcement',
  // </Permission>
};
