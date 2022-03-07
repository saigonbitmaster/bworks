/* eslint-disable no-const-assign */
import {
  CUSTOM_PAGE_REGISTER_SCREEN,
  CUSTOM_PAGE_UNREGISTER_SCREEN,
  CUSTOM_PAGE_SET_PARAMS,
  CUSTOM_PAGE_SET_STATE,
} from '../../actions/customPageActions';
import params from './params';
import subState from './subState';
const initialState = {};

export default (previousState = initialState, action) => {
  if (action.type === CUSTOM_PAGE_REGISTER_SCREEN) {
    const screenState = {
      params: params(undefined, action),
      state: subState(undefined, action),
    };
    const newState = {
      ...previousState,
      [action.payload]: screenState,
    };
    return newState;
  }

  if (action.type === CUSTOM_PAGE_UNREGISTER_SCREEN) {
    const newState = Object.keys(previousState).reduce((acc, key) => {
      if (key === action.payload) {
        return acc;
      }

      return { ...acc, [key]: previousState[key] };
    }, {});
    return newState;
  }

  // if (!action.meta || !action.meta.resource) {
  //   return previousState;
  // }
  if (action.type === CUSTOM_PAGE_SET_PARAMS || action.type === CUSTOM_PAGE_SET_STATE) {
    const newState = Object.keys(previousState).reduce(
      (acc, screen) => ({
        ...acc,
        [screen]:
          action.meta.screen === screen
            ? {
                params: params(previousState[screen].params, action),
                state: subState(previousState[screen].url, action),
              }
            : previousState[screen],
      }),
      {},
    );
    return newState;
  }
  return previousState;
};

export const getResources = state => Object.keys(state).map(key => state[key].props);

export const getReferenceResource = (state, props) => state[props.reference];
