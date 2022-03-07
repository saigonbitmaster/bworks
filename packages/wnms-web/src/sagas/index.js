import persistenceRoot from './persistence';
import { fork } from 'redux-saga/effects';
// import loadConfig from './loadConfig';

export default function* root() {
  yield fork(persistenceRoot);
}
