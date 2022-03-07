import React from 'react';
import { Add, Create, Assignment, Visibility, Delete } from '@material-ui/icons';
import { Taskboard, TaskDetail, TaskEditingPage, TaskCreatingPage } from 'ra-loopback3';
import config from '../../Config';

const CustomTaskboard = props => <Taskboard {...props} projectKey={config.projectKey} screenName={'Taskboard'} />;
const CustomTaskDetail = props => (
  <TaskDetail {...props} screenName={'Taskboard'} permissions={['list', 'edit', 'delete']} />
);
const CustomTaskCreatingPage = props => <TaskCreatingPage projectKey={config.projectKey} {...props} />;
const CustomTaskEditingPage = props => <TaskEditingPage {...props} projectKey={config.projectKey} />;

export default {
  name: 'Taskboard',
  label: 'generic.pages.taskboard',
  icon: Assignment,
  url: 'taskboards',
  screens: {
    list: CustomTaskboard,
    create: CustomTaskCreatingPage,
    edit: CustomTaskEditingPage,
    show: CustomTaskDetail,
  },
  resources: ['tasks'],
  access: {
    view: {
      apis: [
        { url: '/Tasks/getAllEnum', method: 'get' },
        { url: '/Tasks', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Tasks/updateStatus', method: 'patch' },
      ],
      icon: Visibility,
      label: 'resources.tasks.view',
    },
    show: {
      apis: [
        { url: '/Tasks/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/Tasks/getAllEnum', method: 'get' },
        { url: '/Tasks', method: 'get' },
        { url: '/TaskHistories', method: 'get' },
        { url: '/TaskHistories', method: 'post' },
      ],
      icon: Visibility,
      label: 'resources.tasks.show',
    },
    create: {
      apis: [
        { url: '/Tasks/getAllEnum', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/CtmFiles/upload', method: 'post' },
        { url: '/Tasks', method: 'post' },
      ],
      icon: Add,
      label: 'resources.tasks.create',
    },
    edit: {
      apis: [
        { url: '/Tasks/getAllEnum', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/NmsFiles/upload', method: 'post' },
        { url: '/Tasks/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.tasks.edit',
    },
    delete: {
      apis: [{ url: '/Tasks/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.tasks.delete',
    },
  },
};
