import { CUSTOM } from './LoopbackRest';

export const getDmaList = ({ dataProvider, parentDmaId = '', excludeIds = [], deep = 1 }) => {
  return dataProvider(CUSTOM, 'dmas', {
    subUrl: 'list',
    method: 'post',
    body: { parentDmaId: parentDmaId || '', excludeIds, deep },
  }).then(res => res.data);
};
