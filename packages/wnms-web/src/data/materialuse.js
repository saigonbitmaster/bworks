import { CUSTOM } from 'ra-loopback3';

export const getList = ({ dataProvider, dmaIds, types = [], deep = 1 }) => {
  return dataProvider(CUSTOM, 'materialuses', {
    subUrl: 'list',
    method: 'post',
    body: { dmaIds, types, deep },
  }).then(res => res.data);
};

export const getPipeList = ({ dataProvider, dmaIds, deep = 1 }) => {
  return dataProvider(CUSTOM, 'dmas', {
    subUrl: 'pipelist',
    method: 'post',
    body: { dmaIds, deep },
  }).then(res => res.data);
};
