import CommonFields from '../commomFields';
export default {
  fields: {
    clientId: 'Client name',
    newMeterNumber: 'New number',
    oldMeterNumber: 'Previous number',
    setupDate: 'Meter setup date',
    type: 'Type',
    ...CommonFields,
  },
  types: {
    NEW_INSTALL: 'Install new meter',
    REPLACE: 'Replace meter',
  },
};
