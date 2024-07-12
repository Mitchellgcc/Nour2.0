// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import demoReducer from './demoReducer';

const rootReducer = combineReducers({
  demo: demoReducer,
});

export default rootReducer;
