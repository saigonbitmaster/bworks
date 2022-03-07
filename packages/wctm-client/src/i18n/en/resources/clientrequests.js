import commonFields from '../commomFields';
export default {
  name: 'Installation request |||| Installation request',
  fields: {
    title: '',
    type: 'Installation type',
    status: 'Status',
    statusComplete: 'Status',
    startMeterNumber: 'Current meter number',
    oldMeterNumber: 'Old meter number',
    newMeterNumber: 'New meter number',
    rootMeterId: 'Master meter',
    setupDate: 'Setup date',
    description: 'Description',
    issue: 'Issue',
    clientId: 'Client',
    installationTeamId: 'Installation team',
    ...commonFields,
  },
};
