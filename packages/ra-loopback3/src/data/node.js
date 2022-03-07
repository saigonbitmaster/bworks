import { CUSTOM } from './LoopbackRest';

export const getNodeList = ({ dataProvider, center, excludeId, distance = 5000 }) => {
  return dataProvider(CUSTOM, 'nodes', {
    subUrl: 'list',
    method: 'post',
    body: { center: center, distance, excludeId },
  }).then(res => res.data);
};
