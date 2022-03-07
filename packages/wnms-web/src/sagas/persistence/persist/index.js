import { storageSave, signalUnsavedChanges, signalSavedChanges } from '../../../actions/persistState';
import { STORAGE_SAVE_SUCCESS } from '../../../constants/actions';
import Lock from './lock';
import * as PersistenceEngine from './engine';
import { getPersistenceType, PersistenceType } from './whitelist';
import { call, spawn, put, select, take } from 'redux-saga/effects';

const DEBOUNCE_TIME = 3000; // debounce time in milisseconds

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function* save(state, action) {
  yield put(storageSave.request(state));
  try {
    yield call(PersistenceEngine.save, state, action);
    yield put(storageSave.success());
  } catch (e) {
    yield put(storageSave.failure());
  }
}

function* debounceSave(state) {
  yield call(delay, DEBOUNCE_TIME);
  yield call(save, state);
}

export function* signalPersistenceState() {
  yield put(signalUnsavedChanges());
  yield take(STORAGE_SAVE_SUCCESS); // waits for a STORAGE_SAVE success to continue
  yield put(signalSavedChanges());
}

export default function* persistenceSaga() {
  let debounceLock = new Lock(debounceSave);
  let unsavedLock = new Lock(signalPersistenceState);

  while (true) {
    //eslint-disable-line no-constant-condition
    const action = yield take();
    const type = getPersistenceType(action.type);
    if (!type) {
      continue;
    }

    const state = yield select();

    // each persistent action cancels the debounce timer
    yield debounceLock.cancel();

    // this lock prevents multiple unsaved changes actions from being dispatched
    yield unsavedLock.execute();

    if (type === PersistenceType.IMMEDIATE) {
      yield spawn(save, state); // save immediately
    } else if (type === PersistenceType.DEBOUNCE) {
      // a new debounce timer is created
      yield debounceLock.execute(state, action);
    }
  }
}
