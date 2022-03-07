import CommonFields from '../commomFields';
export default {
  fields: {
    clientId: 'Client',
    newMeterNumber: 'new meter number',
    oldMeterNumber: 'current meter number',
    setupDate: 'Setup date',
    type: 'Type',
    ...CommonFields,
  },
  types: {
    NEW_INSTALL: 'New install',
    REPLACE: 'Replace',
  },
};
