/* global window */
/* eslint no-console: 0 */
/* eslint no-else-return: 0 */
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'

import rootReducer from './reducers/rootReducer.js'
// import rootSaga from './sagas/rootSaga.js'

const logger = store => next => action => {
  if (window.reduxLogger === true) {
    console.log('Dispatching action:', action)
    const result = next(action)
    console.log('State after action:', store.getState())
    return result
  } else {
    return next(action)
  }
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(logger, sagaMiddleware))
)

// sagaMiddleware.run(rootSaga)

export default store
