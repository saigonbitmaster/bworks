import set from 'lodash/set';

const INIT_STATE = {
  myaccess: null,
};
export default (previousState = INIT_STATE, { type, payload, meta }) => {
  if (type.indexOf('SF_AUTO_') === 0) {
    if (meta && meta.autoReducer && meta.key) {
      let newState = {};
      set(newState, meta.key, payload);
      return { ...previousState, ...newState };
    }
  }
  return previousState;
};
