import { storageLoad } from '../../../actions/persistState';
import * as PersistenceEngine from '../persist/engine';
import { call, put } from 'redux-saga/effects';

export default function* loadSaga() {
  yield put(storageLoad.request());
  const state = yield call(PersistenceEngine.load);
  yield put(storageLoad.success(state));
}
