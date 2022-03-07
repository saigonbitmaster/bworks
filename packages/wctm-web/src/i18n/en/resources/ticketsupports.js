import commonFields from '../commomFields';
export default {
  name: 'Support ticket |||| Support ticket',
  fields: {
    name: 'Ticket name',
    createdDate: 'Created date',
    createdPerson: 'Created person',
    appUserId: 'Created by',
    isClosed: 'Close ticket',
    receiverId: 'Receivers',
    masterBody: 'Content',
    ticketTypeId: 'Ticket type',
    ticketSupportId: 'Support ticket',
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
  // <Permission>
  view: 'View support ticket list',
  examine: 'Show selected ticket',
  answer: 'Reply ticket',
  delete: 'Delete ticket',
  // </Permission>
};
