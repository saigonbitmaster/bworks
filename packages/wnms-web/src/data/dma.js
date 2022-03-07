import { CUSTOM } from 'ra-loopback3';

export const getDmaList = ({ dataProvider, parentDmaId = '', excludeIds = [], deep = 1 }) => {
  // console.log('getDmaList', parentDmaId, excludeIds, deep);
  return dataProvider(CUSTOM, 'dmas', {
    subUrl: 'list',
    method: 'post',
    body: { parentDmaId: parentDmaId || '', excludeIds, deep },
  }).then(res => res.data);
};
