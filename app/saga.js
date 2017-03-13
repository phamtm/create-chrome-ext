import { takeEvery } from 'redux-saga';
import { fork } from 'redux-saga/effects';

import * as type from './actionType';

function* countUp() {
  console.log('count + 1');
}

function* watchCountUp() {
  yield* takeEvery(type.COUNT_UP, countUp);
}

export default function*() {
  yield* [fork(watchCountUp)];
}
