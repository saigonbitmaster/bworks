import { Add, Create, Search, QuestionAnswer } from '@material-ui/icons';
import { TicketSupportIcon, ViewIcon, DeleteIcon } from '../../styles/Icons';
import ListTicketSupport from './listTicketSupport';
import CreateTicketSupport from './createTicketSupport';
// import EditTicketSupport from './editTicketSupport';
import CreateTicketBody from './createTicketBody';
import ShowTicketSupport from './showTicketSupport';

export default {
  name: 'TicketSupport',
  label: 'generic.pages.TicketSupport',
  icon: TicketSupportIcon,
  url: 'ticketsupport',
  screens: {
    main: ListTicketSupport,
    ticketbody: { component: CreateTicketBody },
    create: CreateTicketSupport,
    // edit: EditTicketSupport,
    show: ShowTicketSupport,
  },
  resources: ['ticketsupports', 'tickettypes', 'ticketpriorities', 'clientusers', 'ticketbodies', 'appusers'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/TicketSupports', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/ClientUsers', method: 'get' },
        { url: '/TicketTypes', method: 'get' },
        { url: '/TicketPriorities', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.ticketsupports.view',
    },
    edit: {
      apis: [
        { url: '/TicketBodies', method: 'get' },
        { url: '/TicketSupports/{id}', method: 'get' },
        { url: '/TicketTypes', method: 'get' },
        { url: '/TicketPriorities', method: 'get' },
        { url: '/ClientUsers', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/TicketSupports/{id}', method: 'put' },
      ],
      icon: Create,
      label: 'resources.ticketsupports.edit',
    },
    delete: {
      apis: [{ url: '/TicketSupports/{id}', method: 'delete' }],
      icon: DeleteIcon,
      label: 'resources.ticketsupports.delete',
    },
    create: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/TicketTypes', method: 'get' },
        { url: '/TicketPriorities', method: 'get' },
        { url: '/ClientUsers', method: 'get' },
        { url: '/TicketSupports', method: 'post' },
      ],
      icon: Add,
      label: 'resources.ticketsupports.create',
    },
    examine: {
      apis: [
        { url: '/TicketBodies', method: 'get' },
        { url: '/AppUsers', method: 'get' },
        { url: '/TicketTypes', method: 'get' },
        { url: '/TicketPriorities', method: 'get' },
        { url: '/ClientUsers', method: 'get' },
        { url: '/TicketSupports/{id}', method: 'get' },
      ],
      icon: Search,
      label: 'resources.ticketsupports.examine',
    },
    answer: {
      apis: [
        { url: '/AppUsers', method: 'get' },
        { url: '/TicketSupports', method: 'get' },
        { url: '/TicketBodies', method: 'post' },
      ],
      icon: QuestionAnswer,
      label: 'resources.ticketsupports.answer',
    },
    read: [],
    write: [],
  },
};
