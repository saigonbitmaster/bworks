import { DesignPipeIcon } from '../../styles/Icons';
import PipeList from './PipeList';
import PipeEdit from './PipeEdit';
import PipeCreate from './PipeCreate';

export default {
  name: 'Pipe',
  label: 'generic.pages.pipe',
  icon: DesignPipeIcon,
  url: 'pipe',
  screens: {
    list: PipeList,
    create: PipeCreate,
    edit: PipeEdit,
  },
  resources: ['pipes'],
  active: true,
  access: {
    read: [],
    write: [],
  },
};
