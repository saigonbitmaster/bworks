import commonFields from '../commomFields';
export default {
  name: 'Request installation |||| Request installation',
  fields: {
    title: 'Title',
    type: 'Type',
    formattedAddress: 'Formatted address',
    status: 'Status',
    statusComplete: 'Status complete',
    startMeterNumber: 'Start meter number',
    oldMeterNumber: 'Old meter number',
    newMeterNumber: 'New meter number',
    rootMeterId: 'Root meter',
    setupDate: 'Setup date',
    description: 'Description',
    issue: 'Issue',
    clientId: 'Client',
    installationTeamId: 'Installation team',
    ...commonFields,
  },
  // <Permission>
  view: 'View',
  export: 'Export Excel',
  completeRequest: 'Complete request',
  showHistory: 'Show history',
  // </Permission>
};
