import { CUSTOM } from './LoopbackRest';

export const getList = ({ dataProvider, dmaIds, types = [], deep = 1 }) => {
  return dataProvider(CUSTOM, 'materialuses', {
    subUrl: 'list',
    method: 'post',
    body: { dmaIds, types, deep },
  }).then(res => res.data);
};
