import commonFields from '../commomFields';
export default {
  name: 'Answer',
  fields: {
    name: 'Name',
    createdDate: 'Created date',
    appUserId: 'Created by',
    isClosed: 'Status',
    masterBody: 'Ticket content',
    ticketTypeId: 'Ticket type',
    ticketSupportId: 'Support ticket name',
    ticketPriorityId: 'Priority',
    reply: 'Reply',
    body: 'Content',
    Id: 'Content detail',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
};
