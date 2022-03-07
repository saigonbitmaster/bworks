import { AnnouncementIcon } from '../../styles/Icons';
import ListAnnouncement from '../../resources/announcement/listAnnouncement';
import ShowAnnouncement from '../../resources/announcement/showAnnouncement';

export default {
  name: 'Announcement',
  label: 'generic.pages.Announcement',
  icon: AnnouncementIcon,
  url: 'announcement',
  screens: {
    main: ListAnnouncement,
    show: ShowAnnouncement,
  },
  resources: ['announcements', 'announcementtypes', 'dmas', 'announcementpriorities', 'clientusers'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
