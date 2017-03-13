import * as types from './actionType';

const init = 0;

function count(state = init, action) {
  switch (action.type) {
    case types.COUNT_DOWN:
      return state - 1;
    case types.COUNT_UP:
      return state + 1;
    default:
      return state;
  }
}

export default {
  count,
};
