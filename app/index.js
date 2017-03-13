import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducer';
import rootSaga from './saga';
import App from './component/App.jsx';
import '../css/style.scss';

// Set up store and saga
const sagaMiddleware = createSagaMiddleware();
const storeEnhancer = compose(applyMiddleware(sagaMiddleware));

const store = createStore(combineReducers(rootReducer), {}, storeEnhancer);
sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
