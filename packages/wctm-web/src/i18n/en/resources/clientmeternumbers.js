import CommonFields from '../commomFields';
export default {
  fields: {
    code: 'Client code',
    name: 'Client name',
    formattedAddress: 'Address',
    clientId: 'Client Id',
    fromDate: 'From date',
    toDate: 'To date',
    previousNumber: 'Previous number',
    newMeterNumberWhenChange: 'Current number on new meter',
    currentNumber: 'Current meter number',
    newMeterNumber: 'New meter number',
    totalWaterUsed: 'Total water usage',
    waterFee: 'Water fee (%)',
    taxFee: 'Tax',
    totalTax: 'Total tax',
    sewageFee: 'Sewage fee (%)',
    totalFee: 'Total fee',
    eInvoiceCode: 'eInvoice code',
    paymentStatus: 'Payment status',
    ...CommonFields,
  },
  permission: {
    listClient: 'Client list',
    listInvoice: 'Invoice list',
    editWriteWater: 'Record/Edit meter number (for meter recording employee)',
    forceEditWriteWater: 'Record/Edit meter number',
    historyWater: 'View meter number history',
    delete: 'Delete client',
    lockInvoice: 'Lock invoice',
    stop: 'Temporary stop client',
    resume: 'Resume client',
    printInvoice: 'Print invoice',
    payInvoice: 'Pay invoice',
    historyInvoice: 'Invoice history',
    writeWater: 'Record meter number',
    trackWriteWaterClient: 'Track meter recording',
    historyDebt: 'Debt history',
    fillZeroTerm: 'Fill empty clients',
    exportEinvoice: 'Export eInvoice',
  },
  userNameWriteMeter: 'Record by',
  writeWater: 'Record meter number',
  wroteWater: 'Meter number recorded',
  unWriteWater: 'UnRecorded',
  changeMeter: 'Replace meter clients',
  inputInvoiceNo: 'Invoice begin number',
  invoiceExportDate: 'Invoice issued date',
};
