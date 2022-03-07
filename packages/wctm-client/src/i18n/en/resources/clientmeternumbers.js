import CommonFields from '../commomFields';
export default {
  fields: {
    clientId: 'Client',
    fromDate: 'From',
    toDate: 'To',
    previousNumber: 'Previous number',
    currentNumber: 'Current number',
    newMeterNumber: 'New number',
    totalWaterUsed: 'Consumption volume',
    waterFee: 'Water fee',
    taxFee: 'Tax',
    sewageFee: 'Sewage fee',
    totalFee: 'Total fee',
    paymentStatus: 'Payment status',
    ...CommonFields,
  },
};
