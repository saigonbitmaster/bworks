import {
  STORAGE_SAVE_REQUEST,
  STORAGE_SAVE_SUCCESS,
  STORAGE_SAVE_FAILURE,
  UNSAVED_CHANGES,
  SAVED_CHANGES,
} from '../constants/actions';

export const storageSave = {
  request: state => {
    return { type: STORAGE_SAVE_REQUEST, payload: state };
  },
  success: () => {
    return { type: STORAGE_SAVE_SUCCESS };
  },
  failure: () => {
    return { type: STORAGE_SAVE_FAILURE };
  },
};

export const storageLoad = {
  request: () => {
    return { type: STORAGE_SAVE_REQUEST };
  },
  success: state => {
    return { type: STORAGE_SAVE_SUCCESS, payload: state };
  },
  failure: () => {
    return { type: STORAGE_SAVE_FAILURE };
  },
};

export function signalUnsavedChanges() {
  return {
    type: UNSAVED_CHANGES,
  };
}

export function signalSavedChanges() {
  return {
    type: SAVED_CHANGES,
  };
}
