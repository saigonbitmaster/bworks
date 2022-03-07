// import { Add, Create, Search } from '@material-ui/icons';
import { Conversation, ViewIcon } from '../../styles/Icons';
import ConversationList from './ConversationList';

export default {
  name: 'Conversation',
  label: 'generic.pages.conversation',
  icon: Conversation,
  url: 'conversation',
  screens: {
    list: ConversationList,
  },
  resources: ['conversations'],
  active: true,
  access: {
    view: {
      apis: [
        { url: '/conversations', method: 'get' },
        { url: '/conversations/{id}', method: 'get' },
      ],
      icon: ViewIcon,
      label: 'resources.conversations.name',
    },
    read: [],
    write: [],
  },
};
