import load from './load';
import persistence from './persist';
import { fork, all } from 'redux-saga/effects';

export default function* persistenceRoot() {
  yield all([fork(load), fork(persistence)]);
}
