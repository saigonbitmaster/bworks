import { showNotification, USER_LOGIN_SUCCESS } from 'ra-loopback3';
import { put, takeEvery } from 'redux-saga/effects';

export default function* bitcoinSaga() {
  yield takeEvery(USER_LOGIN_SUCCESS, function*() {
    yield put(showNotification('Bitcoin rate updated'));
  });
}
