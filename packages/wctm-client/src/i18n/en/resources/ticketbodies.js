import commonFields from '../commomFields';
export default {
  name: 'Anser',
  fields: {
    name: 'Name',
    createdDate: 'Created date',
    appUserId: 'Created person',
    createdPerson: 'Created person',
    isClosed: 'Status',
    masterBody: 'Support content',
    ticketTypeId: 'Support type',
    ticketSupportId: 'Ticket name',
    ticketPriorityId: 'Priority',
    reply: 'Reply',
    body: 'Content',
    Id: 'Detail content',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edir',
  show: 'Show',
};
