export const UPDATE_RIGHT_DRAWER = 'RA_UPDATE_RIGHT_DRAWER';
export const RIGHT_DRAWER_DATA = 'RA_RIGHT_DRAWER_DATA';

export const showRightDrawer = (dialog, options = null) => ({
  type: UPDATE_RIGHT_DRAWER,
  payload: { element: dialog, options },
});

export const hideRightDrawer = () => ({
  type: UPDATE_RIGHT_DRAWER,
  payload: { element: null, options: null },
});

export const rightDrawerData = options => ({
  type: RIGHT_DRAWER_DATA,
  payload: options,
});
