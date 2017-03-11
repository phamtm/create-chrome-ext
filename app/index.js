import { h, render } from 'preact';
import { Provider } from 'preact-redux';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducer';
import App from './App.jsx';

// Set up store and saga
const sagaMiddleware = createSagaMiddleware();
const storeEnhancer = compose(applyMiddleware(sagaMiddleware));

const store = createStore(combineReducers(rootReducer), {}, storeEnhancer);
// sagaMiddleware.run();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
