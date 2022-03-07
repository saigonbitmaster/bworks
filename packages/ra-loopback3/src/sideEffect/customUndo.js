import { showNotification } from 'ra-core/lib/actions/notificationActions';
import { UNDO, COMPLETE, startOptimisticMode, stopOptimisticMode } from 'ra-core/lib/actions/undoActions';
import {
  // CRUD_UPDATE_OPTIMISTIC,
  // CRUD_UPDATE_MANY_OPTIMISTIC,
  CRUD_DELETE_OPTIMISTIC,
  CRUD_DELETE_MANY_OPTIMISTIC,
} from 'ra-core/lib/actions/dataActions';
import { refreshView } from 'ra-core/lib/actions/uiActions';
import { take, takeEvery, put, race } from 'redux-saga/effects';
import { CUSTOM_UNDOABLE } from '../actions/customUndoAbleAction';

export function* handleUndoRace(undoableAction) {
  const {
    payload: { action },
  } = undoableAction;
  // deleteData: { resource, id || ids}
  // updateData: not support yet!
  const { onSuccess = {}, onFailure = {}, deleteData = {}, ...metaWithoutSideEffects } = action.meta;
  yield put(startOptimisticMode());
  let forwardType = CUSTOM_UNDOABLE;
  if (deleteData && deleteData.resource) {
    forwardType = deleteData.id ? CRUD_DELETE_OPTIMISTIC : CRUD_DELETE_MANY_OPTIMISTIC;
  }

  // dispatch action in optimistic mode (no fetch), with success side effects
  yield put({
    ...action,
    type: `${forwardType}_OPTIMISTIC`,
    meta: {
      ...deleteData,
      ...metaWithoutSideEffects,
      ...onSuccess,
      optimistic: true,
    },
  });
  // wait for undo or delay
  const { complete } = yield race({
    undo: take(UNDO),
    complete: take(COMPLETE),
  });
  yield put(stopOptimisticMode());
  if (complete) {
    // if not cancelled, redispatch the action, this time immediate, and without success side effect
    // in case method
    if (typeof action.payload === 'function') {
      let result = yield action.payload();
      const { error, data = null } = result || {};
      if (error) {
        yield put({
          type: `${forwardType}_FAILURE`,
          error: error.message ? error.message : error,
          payload: error.body ? error.body : null,
          requestPayload: action.payload,
          meta: {
            ...onFailure,
            type: forwardType,
            status: `${CUSTOM_UNDOABLE}_ERROR`,
          },
        });
      } else {
        const { notification, ...restOnSuccess } = onSuccess;
        yield put({
          type: `${forwardType}_SUCCESS`,
          payload: data,
          requestPayload: action.payload,
          meta: {
            ...restOnSuccess,
            type: forwardType,
            status: `${forwardType}_SUCCESS`,
          },
        });
      }
    } else {
      yield put({
        ...action,
        meta: {
          ...metaWithoutSideEffects,
          onSuccess: { refresh: true },
          onFailure: { ...onFailure, refresh: true },
        },
      });
    }
  } else {
    yield put(showNotification('ra.notification.canceled'));
    yield put(refreshView());
  }
}

export default function* watchUndoable() {
  yield takeEvery(CUSTOM_UNDOABLE, handleUndoRace);
}
