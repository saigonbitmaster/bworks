export const UPDATE_DIALOG = 'RA_UPDATE_DIALOG';
export const DIALOG_DATA = 'RA_DIALOG_DATA';

export const showDialog = (dialog, data = null) => ({
  type: UPDATE_DIALOG,
  payload: { element: dialog, data },
});

export const hideDialog = () => ({
  type: UPDATE_DIALOG,
  payload: null,
});

export const dialogData = data => ({
  type: DIALOG_DATA,
  payload: data,
});
