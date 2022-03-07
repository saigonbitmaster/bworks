import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Ticket name',
    createdDate: 'Created date',
    appUserId: 'Created person',
    clientUserId: 'Created person',
    createdPerson: 'Created person',
    isClosed: 'Close ticket',
    masterBody: 'Content',
    ticketTypeId: 'Ticket type',
    ticketSupportId: 'Support ticket',
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
