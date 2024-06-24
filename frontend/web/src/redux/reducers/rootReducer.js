// src/redux/reducers/rootReducer.js
import { combineReducers } from 'redux';
// Import your individual reducers here
import authReducer from './authReducer';
import otherReducer from './otherReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  other: otherReducer,
  // Add other reducers here
});

export default rootReducer;