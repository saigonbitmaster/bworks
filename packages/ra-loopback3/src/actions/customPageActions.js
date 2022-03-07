// Register store
export const CUSTOM_PAGE_REGISTER_SCREEN = 'CUSTOM_PAGE_REGISTER_SCREEN';
export const customPageRegisterResource = function(screen) {
  return {
    type: CUSTOM_PAGE_REGISTER_SCREEN,
    payload: screen,
  };
};

export const CHECK_REGISTER = 'CHECK_REGISTER';
export const checkRegister = screen => {
  return {
    type: CHECK_REGISTER,
    payload: screen,
  };
};
export const CUSTOM_PAGE_UNREGISTER_SCREEN = 'CUSTOM_PAGE_UNREGISTER_SCREEN';
export const customPageUnregisterResource = function(screen) {
  return {
    type: CUSTOM_PAGE_UNREGISTER_SCREEN,
    payload: screen,
  };
};

// Save Filter
export const CUSTOM_PAGE_SET_FILTER = 'CUSTOM_PAGE_SET_FILTER';
export const customPageSetFilter = payload => ({ type: CUSTOM_PAGE_SET_FILTER, payload });
export const CUSTOM_PAGE_GET_FILTER = 'CUSTOM_PAGE_GET_FILTER';
export const customPageGetFilterAction = () => ({ type: CUSTOM_PAGE_GET_FILTER });

// Save Params
export const CUSTOM_PAGE_SET_PARAMS = 'CUSTOM_PAGE_SET_PARAMS';
export const SET_FILTERS = 'SET_FILTERS';
export const SEND_PARAMS = 'SEND_PARAMS';
export const sendParams = (screen, params) => {
  return {
    type: SEND_PARAMS,
    payload: params,
    meta: { screen, type: 'customPage' },
  };
};

// Save custom state:
export const CUSTOM_PAGE_SET_STATE = 'CUSTOM_PAGE_SET_STATE';
export const customPageSetState = function(screen, state) {
  return {
    type: CUSTOM_PAGE_SET_STATE,
    payload: state,
    meta: { screen, type: 'customPage' },
  };
};
