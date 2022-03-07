import { Add, Create, Search, Delete } from '@material-ui/icons';
import { AnnouncementIcon, ViewIcon } from '../../styles/Icons';
import ListAnnouncement from '../../resources/announcement/listAnnouncement';
import CreateAnnouncement from '../../resources/announcement/createAnnouncement';
import EditAnnouncement from '../../resources/announcement/editAnnouncement';
import ShowAnnouncement from '../../resources/announcement/showAnnouncement';

export default {
  name: 'Announcement',
  label: 'generic.pages.Announcement',
  icon: AnnouncementIcon,
  url: 'announcement',
  screens: {
    main: ListAnnouncement,
    create: CreateAnnouncement,
    edit: EditAnnouncement,
    show: ShowAnnouncement,
  },
  resources: ['announcements', 'announcementtypes', 'dmas', 'announcementpriorities', 'appusers'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/Announcements', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/AnnouncementTypes', method: 'get' },
        { url: '/AnnouncementPriorities', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.announcements.view',
    },
    edit: {
      apis: [
        { url: '/Announcements/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/AnnouncementTypes', method: 'get' },
        { url: '/AnnouncementPriorities', method: 'get' },
        { url: '/Announcements/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.announcements.edit',
    },
    delete: {
      apis: [{ url: '/Announcements/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.announcements.delete',
    },
    create: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/AnnouncementTypes', method: 'get' },
        { url: '/AnnouncementPriorities', method: 'get' },
        { url: '/Announcements', method: 'post' },
      ],
      icon: Add,
      label: 'resources.announcements.create',
    },
    examine: {
      apis: [
        { url: '/Dmas', method: 'get' },
        { url: '/Announcements/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/AnnouncementTypes', method: 'get' },
        { url: '/AnnouncementPriorities', method: 'get' },
      ],
      icon: Search,
      label: 'resources.announcements.examine',
    },
    read: [],
    write: [],
  },
};
