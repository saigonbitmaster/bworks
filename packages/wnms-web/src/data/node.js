import { CUSTOM } from 'ra-loopback3';

export const getNodeList = ({ dataProvider, center, distance = 5000 }) => {
  return dataProvider(CUSTOM, 'nodes', {
    subUrl: 'list',
    method: 'post',
    body: { center: center, distance },
  }).then(res => res.data);
};
