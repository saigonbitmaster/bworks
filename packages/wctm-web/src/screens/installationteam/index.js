import { Add, Create, Search, Delete } from '@material-ui/icons';
import { InstallationTeamIcon, ViewIcon } from '../../styles/Icons';
import ListInstallationTeam from '../../resources/installationteam/listInstallationTeam';
import CreateInstallationTeam from '../../resources/installationteam/createInstallationTeam';
import EditInstallationTeam from '../../resources/installationteam/editInstallationTeam';
import ShowInstallationTeam from '../../resources/installationteam/showInstallationTeam';

export default {
  name: 'InstallationTeam',
  label: 'generic.pages.installationTeam',
  icon: InstallationTeamIcon,
  url: 'installationteam',
  screens: {
    list: ListInstallationTeam,
    create: CreateInstallationTeam,
    edit: EditInstallationTeam,
    show: ShowInstallationTeam,
  },
  resources: ['installationteams', 'appusers'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/InstallationTeams', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.installationteams.view',
    },
    edit: {
      apis: [
        { url: '/InstallationTeams/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/InstallationTeams/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.installationteams.edit',
    },
    delete: {
      apis: [{ url: '/InstallationTeams/{id}', method: 'delete' }],
      icon: Delete,
      label: 'resources.installationteams.delete',
    },
    create: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/InstallationTeams', method: 'post' },
      ],
      icon: Add,
      label: 'resources.installationteams.create',
    },
    examine: {
      apis: [
        { url: '/InstallationTeams/{id}', method: 'get' },
        { url: '/AppUsers', method: 'get' },
      ],
      icon: Search,
      label: 'resources.installationteams.examine',
    },
    read: [],
    write: [],
  },
};
