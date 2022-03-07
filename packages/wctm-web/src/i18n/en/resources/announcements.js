import commonFields from '../commomFields';
export default {
  name: 'Announcement |||| Announcement',
  fields: {
    clientname: 'Announcement name',
    abc: 'Abc',
    createdDate: 'Created date',
    appUserId: 'Creator',
    sendDate: 'Sending date',
    masterBody: 'Content',
    announcementTypeId: 'Announcement type',
    announcementPriorityId: 'Announcement priority',
    dmaIds: 'Send to DMAs',
    shortContent: 'Short content',
    fullContent: 'Full content',
    sendPublic: 'Send to public',
    ...commonFields,
  },
  list: 'List',
  create: 'Create',
  edit: 'Edit',
  show: 'Show',
  // <Permission>
  view: 'View announcement list',
  examine: 'Show announcement information',
  delete: 'Delete announcement information',
  // </Permission>
};
