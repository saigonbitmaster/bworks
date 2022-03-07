import commonFields from '../commomFields';
// import unit from '../unit';
export default {
  fields: {
    name: 'Task',
    status: 'Status',
    statuses: {
      todo: 'New',
      doing: 'In process',
      finish: 'Finished',
    },
    type: 'Type',
    types: {
      office: 'Office',
      technical: 'Technical',
      other: 'Other',
    },
    priority: 'Priority',
    priorities: {
      urgent: 'Urgent',
      high: 'High',
      normal: 'Normal',
      low: 'Low',
    },
    startDate: 'Create date',
    dueDate: 'Due date',
    finishDate: 'Finished date',
    estimateTime: 'Estimated days',
    attachedFiles: 'Attach file',
    assigneeId: 'Assignee',
    ...commonFields,
  },
  list: 'Task list',
  create: 'Create task',
  edit: 'Edit task',
  show: 'Task detail',
  file: 'File',
  view: 'View task list',
  delete: 'Delete task',
};
