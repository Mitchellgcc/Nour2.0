// src/redux/store.js
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Correct default import
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers/rootReducer';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;