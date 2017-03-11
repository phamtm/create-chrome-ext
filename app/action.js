import { COUNT_DOWN, COUNT_UP } from './actionType';

function action(actionType, ...payload) {
  return {
    type: actionType,
    ...payload
  };
}

export function countUp() {
  return action(COUNT_UP);
}

export function countDown() {
  return action(COUNT_DOWN);
}
