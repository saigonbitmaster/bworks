import { TicketSupportIcon } from '../../styles/Icons';
import ListTicketSupport from '../../resources/ticketSupport/listTicketSupport';
import CreateTicketSupport from '../../resources/ticketSupport/createTicketSupport';
import EditTicketSupport from '../../resources/ticketSupport/editTicketSupport';
import CreateTicketBody from '../../resources/ticketSupport/createTicketBody';
import ShowTicketSupport from '../../resources/ticketSupport/showTicketSupport';

export default {
  name: 'TicketSupport',
  label: 'generic.pages.TicketSupport',
  icon: TicketSupportIcon,
  url: 'ticketsupport',
  screens: {
    main: ListTicketSupport,
    ticketbody: { component: CreateTicketBody },
    create: CreateTicketSupport,
    edit: EditTicketSupport,
    show: ShowTicketSupport,
  },
  resources: ['ticketsupports', 'tickettypes', 'ticketpriorities', 'ticketbodies', 'clientusers', 'appusers'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
