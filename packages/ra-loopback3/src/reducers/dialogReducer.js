import { UPDATE_DIALOG, DIALOG_DATA } from '../actions/dialogAction';
export default (previousState = { element: null, data: null }, { type, payload }) => {
  switch (type) {
    case UPDATE_DIALOG:
      return payload;
    case DIALOG_DATA:
      return { ...previousState, data: payload };
    default:
      return previousState;
  }
};
