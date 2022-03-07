import { UPDATE_RIGHT_DRAWER, RIGHT_DRAWER_DATA } from '../actions/rightDrawerAction';
export default (previousState = { element: null, options: null, updateCount: 0 }, { type, payload }) => {
  switch (type) {
    case UPDATE_RIGHT_DRAWER:
      return { ...payload, updateCount: previousState.updateCount + 1 };
    case RIGHT_DRAWER_DATA:
      if (previousState.element) return { element: previousState.element, options: payload };
      return previousState;
    default:
      return previousState;
  }
};
