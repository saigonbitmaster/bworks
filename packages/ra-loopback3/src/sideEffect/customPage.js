import { select, put, takeEvery, fork } from 'redux-saga/effects';
import {
  CUSTOM_PAGE_REGISTER_SCREEN,
  CHECK_REGISTER,
  CUSTOM_PAGE_SET_PARAMS,
  SEND_PARAMS,
} from '../actions/customPageActions';

// export default function* registerResource() {
//   while (true) {
//     const action = yield take(CHECK_REGISTER);
//     const state = yield select(state => state.customPage);
//     if (!state[action.payload]) {
//       yield put({ type: CUSTOM_PAGE_REGISTER_RESOURCE, payload: action.payload });
//     }
//   }
// }

export default function* rootSaga() {
  yield fork(watchRegister);
  yield fork(watchSetParams);
}

function* watchRegister() {
  yield takeEvery(CHECK_REGISTER, action => checkRegister(action));
}

function* checkRegister(action) {
  const state = yield select(state => state.customPage);
  if (!state[action.payload]) {
    const { payload: screen } = action;
    yield put({
      type: CUSTOM_PAGE_REGISTER_SCREEN,
      payload: screen,
      meta: {
        screen,
      },
    });
  }
}

function* watchSetParams() {
  yield takeEvery(SEND_PARAMS, action => setParams(action));
}

function* setParams(action) {
  const {
    payload: params,
    meta: { screen },
  } = action;
  const state = yield select(state => state.customPage);
  if (screen && state[screen]) {
    yield put({
      type: CUSTOM_PAGE_SET_PARAMS,
      payload: params,
      meta: {
        screen,
      },
    });
  }
}
