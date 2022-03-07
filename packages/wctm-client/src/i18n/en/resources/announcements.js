import commonFields from '../commomFields';
export default {
  name: '',
  fields: {
    name: 'Announcement name',
    createdDate: 'Created date',
    appUserId: 'Created person',
    sendDate: 'Sending date',
    masterBody: 'Content',
    announcementTypeId: 'Announcement type',
    announcementPriorityId: 'Priority',
    dmaIds: 'To DMAs',
    shortContent: 'Summary',
    fullContent: 'Short content',
    sendPublic: 'Send to all',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
};
