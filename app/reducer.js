import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
const storeEnhancer = compose(applyMiddleware(sagaMiddleware));

const store = createStore({}, null, storeEnhancer);
// sagaMiddleware.run();
