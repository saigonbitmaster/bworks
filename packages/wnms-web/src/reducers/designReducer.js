import { MAP_DESIGN_SELECTED } from '../screens/design/actions';
import config from '../Config';
const initData = {
  viewSelected: [],
  viewDmaId: '',
  update: 0,
  defaultZoom: config.mapDefaultZoom,
  defaultCenter: config.mapDefaultCenter,
};
export default (previousState = initData, { type, payload }) => {
  switch (type) {
    case MAP_DESIGN_SELECTED:
      return {
        ...previousState,
        ...payload,
      };
    default:
      return previousState;
  }
};
